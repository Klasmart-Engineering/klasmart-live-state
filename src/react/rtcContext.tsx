import React from "react";
import {TrackSender} from "../network/trackSender";
import {
    SfuId,
    SfuAuthErrors,
    SfuConnectionError,
    AuthorizationError,
    AuthenticationError,
    MissingAuthenticationError, TokenMismatchError, MissingAuthorizationError, DerivedTrackState
} from "../network/sfuTypes";
import {SFU} from "../network/sfu";
import {Room, TrackLocation} from "../network/room";
import EventEmitter from "eventemitter3";
import {deferred} from "../deferred";

enum SfuAuthErrorCodes {
    INVALID = 4400,
    EXPIRED = 4401,
    NOT_BEFORE = 4403,
    UNKNOWN_ERROR = 4500
}

export type WebRtcManagerEventMap = {
    tokenMismatchError: (error: TokenMismatchError) => void;
    authenticationMissingError: (error: MissingAuthenticationError) => void;
    authorizationMissingError: (error: MissingAuthorizationError) => void;
    authorizationInvalidError: (error: AuthorizationError) => void;
    authorizationExpiredError: (error: AuthorizationError) => void;
    authenticationInvalidError: (error: AuthenticationError) => void;
    authenticationExpiredError: (error: AuthenticationError) => void;
    unknownError: (error: Error) => void;
};

export type SenderType = "microphone" | "camera" | "screenshare-video";

export class WebRtcManager {
    private maxSfuRetries = 10;
    public readonly room: Room;
    public microphoneConstraints?: MediaStreamConstraints["audio"];
    private microphone?: TrackSender;
    private camera?: TrackSender;
    private screenshare?: TrackSender;
    public cameraConstraints?: MediaStreamConstraints["video"];
    public screenshareConstraints?: DisplayMediaStreamConstraints;
    private emitter = new EventEmitter<WebRtcManagerEventMap>();

    public readonly on: EventEmitter<WebRtcManagerEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly once: EventEmitter<WebRtcManagerEventMap>["once"] = (event, listener) => this.emitter.once(event, listener);
    public readonly off: EventEmitter<WebRtcManagerEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);

    public constructor(
        public readonly baseEndpoint: URL,
        public readonly sessionId?: string,
    ) {
        if(baseEndpoint.protocol === "https:") { baseEndpoint.protocol = "wss:"; }
        if(baseEndpoint.protocol === "http:") { baseEndpoint.protocol = "ws:"; }
        const wsEndpoint = new URL(baseEndpoint.toString());
        wsEndpoint.pathname += "room";
        this.room = new Room(wsEndpoint.toString());
    }

    private createSender(senderType: SenderType, track: Promise<MediaStreamTrack>) {
        const sender = new TrackSender(
            senderType,
            track,
            this.selectProducerSfu(),
            this.sessionId
        );
        sender.on("statechange", (state) => {
            console.log(`${senderType} sender state: ${state}`);
        });
        return sender;
    }

    public getCamera(): TrackSender {
        if (!this.camera) {
            const { resolve, promise: track } = deferred<MediaStreamTrack>();
            this.camera = this.createSender("camera", track);
            this.camera.on("waitForTrack", async () => {
                resolve(await cameraGetter(this.cameraConstraints));
            });
            this.camera.on("statechange", async (state) => {
                if (state === "close" || state === "new" || state === "switching-sfu") {
                    await this.camera?.creating();
                }
            });
        }
        return this.camera;
    }

    public getMicrophone(): TrackSender {
        if (!this.microphone) {
            const { resolve, promise: track } = deferred<MediaStreamTrack>();
            this.microphone = this.createSender("microphone", track);
            this.microphone.on("waitForTrack", async () => {
                resolve(await microphoneGetter(this.microphoneConstraints));
            });
            this.microphone.on("statechange", (state) => {
                if (state === "close" || state === "new" || state === "switching-sfu")
                    this.microphone?.creating();
            });
        }
        return this.microphone;
    }

    public getScreenshare(): TrackSender {
        if (!this.screenshare) {
            const { resolve, promise: track } = deferred<MediaStreamTrack>();
            this.screenshare = this.createSender("screenshare-video", track);
            this.screenshare.on("waitForTrack", async () => {
                resolve(await screenshareGetter(this.screenshareConstraints));
            });
            this.screenshare.on("statechange", async (state) => {
                if (state === "switching-sfu" || state === "new") {
                    return this.screenshare?.creating();
                }
                if (state === "not-sending") {
                    this.screenshare?.close();
                    this.screenshare = undefined;
                    return;
                }
            });
        }
        return this.screenshare;
    }

    public async pauseForEveryone({sfuId, producerId}: TrackLocation, paused: boolean) {
        const sfu = this.sfus.get(sfuId);
        if(!sfu) {throw new Error(`Not connected to SFU(${sfuId})`); }
        await sfu.pauseGlobally(producerId, paused);
    }

    public async pause({sfuId, producerId}: TrackLocation, paused: boolean) {
        const sfu = this.sfus.get(sfuId);
        if(!sfu) {throw new Error(`Not connected to SFU(${sfuId})`); }
        await sfu.pause(producerId, paused);
    }

    public async close() {
        await this.room.close();
        await Promise.allSettled(
            [...this.sfus.values()].map(s => s.close())
        );
    }

    private async onSfuConnectionError(error: SfuConnectionError) {
        if (error.retries < this.maxSfuRetries || !this.sfus.has(error.id)) {
            return;
        }
        try {
            if (error.producerError) {
                console.error(`Cannot seem to reliably connect to SFU(${error.id}), attempting to acquire a different sfu`);
                const sfu = await this.selectProducerSfu(error.id);
                const promises = [
                    this.camera,
                    this.microphone,
                    this.screenshare,
                ].flatMap(sender => {
                    if(!sender || sender.sfuId !== error.id) { return []; }
                    return sender.switchSfu(sfu);
                });
                await Promise.allSettled(promises);
            }

            await this.removeSfu(error.id);
        }
        catch (e) {
            console.error(e);
        }
    }

    private async removeSfu(id: SfuId) {
        const sfu = this.sfus.get(id);
        await sfu?.close();
        this.sfus.delete(id);
        await this.room.removeSfuId(id);
    }

    private onSfuAuthError(error: SfuAuthErrors) {
        console.error(error.name);
        switch (error.name) {
        case "AuthenticationError":
            this.onAuthenticationError(error);
            break;
        case "AuthorizationError":
            this.onAuthorizationError(error);
            break;
        case "TokenMismatchError":
            this.emitter.emit("tokenMismatchError", error);
            break;
        case "MissingAuthenticationError":
            this.emitter.emit("authenticationMissingError", error);
            break;
        case "MissingAuthorizationError":
            this.emitter.emit("authorizationMissingError", error);
            break;
        default:
            this.emitter.emit("unknownError", error);
        }
    }

    private onAuthorizationError(error: AuthorizationError) {
        switch (error.code) {
        case SfuAuthErrorCodes.INVALID:
            this.emitter.emit("authorizationInvalidError", error);
            break;
        case SfuAuthErrorCodes.EXPIRED:
            this.emitter.emit("authorizationExpiredError", error);
            break;
        case SfuAuthErrorCodes.NOT_BEFORE:
        case SfuAuthErrorCodes.UNKNOWN_ERROR:
        default:
            this.emitter.emit("unknownError", error);
        }
    }

    private onAuthenticationError(error: AuthenticationError) {
        switch (error.code) {
        case SfuAuthErrorCodes.INVALID:
            this.emitter.emit("authenticationInvalidError", error);
            break;
        case SfuAuthErrorCodes.EXPIRED:
            this.emitter.emit("authenticationExpiredError", error);
            break;
        case SfuAuthErrorCodes.NOT_BEFORE:
        case SfuAuthErrorCodes.UNKNOWN_ERROR:
        default:
            this.emitter.emit("unknownError", error);
        }
    }

    private readonly sfus = new Map<SfuId, SFU>();
    public get sfuIdsHash() {
        return Array.from(this.sfus.keys()).sort().join(",");
    }
    public subscribeToSfuTrackStateUpdates(callback: (state: DerivedTrackState[]) => void) {
        for (const sfu of this.sfus.values()) {
            sfu.emitter.on("trackStatesUpdate", callback);
        }
    }
    public unsubscribeToSfuTrackStateUpdates(callback: (state: DerivedTrackState[]) => void) {
        for (const sfu of this.sfus.values()) {
            sfu.emitter.off("trackStatesUpdate", callback);
        }
    }

    public sfu(id: SfuId) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            const url = this.getSfuUrl(id);
            sfu = new SFU(id, url, this.room);
            sfu.emitter.on("authError", (err) => this.onSfuAuthError(err));
            sfu.emitter.on("connectionError", (err) => this.onSfuConnectionError(err));
            this.sfus.set(id, sfu);
        }
        return sfu;
    }

    private async selectProducerSfu(excludeId?: SfuId) {
        const id = await this.room.getProducerSfuId(excludeId);
        return this.sfu(id);
    }

    private getSfuUrl(id?: SfuId) {
        const wsEndpoint = new URL(this.baseEndpoint.toString());
        wsEndpoint.pathname += `sfuid/${id}`;
        return wsEndpoint.toString();
    }

    public getAllSfuTrackStates() {
        return Array.from(this.sfus.values()).flatMap((sfu) => {
            return Array.from(sfu.trackStates.values());
        });
    }
}

export function audioTrack(stream: MediaStream) {
    return firstTrack(stream.getAudioTracks());
}
export function videoTrack(stream: MediaStream) {
    return firstTrack(stream.getVideoTracks());
}
export function firstTrack(tracks: MediaStreamTrack[]) {
    const track = tracks[0];
    if(!track) { throw new Error("Could not get media track"); }
    if(tracks.length > 1) { console.info(`Got ${tracks.length} media tracks, can only use 1`); }
    return track;
}

async function microphoneGetter(
    getAudioConstraints?: MediaStreamConstraints["audio"]
) {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: getAudioConstraints || true,
    });
    return audioTrack(stream);
}

async function cameraGetter(
    videoConstraints?: MediaStreamConstraints["video"]
) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints || true,
    });
    return videoTrack(stream);
}

async function screenshareGetter(
    screenshareConstraints?: DisplayMediaStreamConstraints
) {
    const stream = await navigator.mediaDevices.getDisplayMedia(screenshareConstraints);
    return videoTrack(stream);
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = "KidsloopLiveWebRTC";

