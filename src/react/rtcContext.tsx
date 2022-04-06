import React from "react";
import { TrackSender } from "../network/trackSender";
import {SFU, SfuId, SfuAuthErrors, SfuConnectionError} from "../network/sfu";
import {Room, TrackLocation} from "../network/room";


export class WebRtcManager {
    public microphoneConstraints?: MediaStreamConstraints["audio"];
    public readonly microphone = new TrackSender(
        () => this.selectProducerSfu(),
        microphoneGetter(() => this.microphoneConstraints),
        "microphone",
        this.sessionId,
    );

    public cameraConstraints?: MediaStreamConstraints["video"];
    public readonly camera = new TrackSender(
        () => this.selectProducerSfu(),
        cameraGetter(() => this.cameraConstraints),
        "camera",
        this.sessionId,
    );

    public screenshareConstraints?: DisplayMediaStreamConstraints;
    public readonly screenshare = new TrackSender(
        () => this.selectProducerSfu(),
        screenshareGetter(() => this.screenshareConstraints),
        "screenshare-video",
        this.sessionId,
    );

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

    public readonly room: Room;

    public constructor(
        public readonly baseEndpoint: URL,
        public readonly sessionId?: string,
        private onAuthorizationInvalid?: () => unknown,
        private onAuthorizationExpired?: () => unknown,
        private onAuthenticationExpired?: () => unknown,
        private onAuthenticationInvalid?: () => unknown,
        private onTokenMismatch?: () => unknown,
        private onMissingAuthenticationToken?: () => unknown,
        private onMissingAuthorizationToken?: () => unknown
    ) {
        if(baseEndpoint.protocol === "https:") { baseEndpoint.protocol = "wss:"; }
        if(baseEndpoint.protocol === "http:") { baseEndpoint.protocol = "ws:"; }
        const wsEndpoint = new URL(baseEndpoint.toString());
        wsEndpoint.pathname += "room";
        this.room = new Room(wsEndpoint.toString());
    }

    private async onSfuConnectionError(error: SfuConnectionError) {
        if (error.retries < 10 || !this.sfus.has(error.id)) {
            return;
        }
        try {
            if (error.producerError) {
                console.error(`Cannot seem to reliably connect to SFU(${error.id}), attempting to acquire a different sfu`);
                await this.selectProducerSfu(error.id);
                const promises = [
                    this.camera,
                    this.microphone,
                    this.screenshare,
                ].flatMap(sender => {
                    if(sender.sfuId !== error.id) { return []; }
                    return sender.changeState("switching-sfu");
                });
                await Promise.allSettled(promises);
            }

            const sfu = this.sfus.get(error.id);
            await sfu?.close();
            this.sfus.delete(error.id);
            await this.room.removeSfuId(error.id);
        } catch (e) {
            console.error(e);
        }
    }

    private onSfuAuthError(error: SfuAuthErrors) {
        console.error(error.name);
        enum SfuAuthErrorCodes {
            INVALID = 4400,
            EXPIRED = 4401,
            NOT_BEFORE = 4403,
            UNKNOWN_ERROR = 4500
        }

        switch (error.name) {
        case "AuthenticationError":
            switch (error.code){
            case SfuAuthErrorCodes.INVALID:
                if (this.onAuthenticationInvalid) {
                    this.onAuthenticationInvalid();
                } else {
                    console.error("INVALID_AUTHENTICATION not handled");
                }
                break;
            case SfuAuthErrorCodes.EXPIRED:
                if (this.onAuthenticationExpired) {
                    this.onAuthenticationExpired();
                } else {
                    console.error("EXPIRED_AUTHENTICATION not handled");
                }
                break;
            case SfuAuthErrorCodes.NOT_BEFORE:
            case SfuAuthErrorCodes.UNKNOWN_ERROR:
            default:
                console.error(JSON.stringify(error));
            }
            break;
        case "AuthorizationError":
            switch (error.code){
            case SfuAuthErrorCodes.INVALID:
                if (this.onAuthorizationInvalid) {
                    this.onAuthorizationInvalid();
                } else {
                    console.error("INVALID_AUTHORIZATION not handled");
                }
                break;
            case SfuAuthErrorCodes.EXPIRED:
                if (this.onAuthorizationExpired) {
                    this.onAuthorizationExpired();
                } else {
                    console.error("EXPIRED_AUTHORIZATION not handled");
                }
                break;
            case SfuAuthErrorCodes.NOT_BEFORE:
            case SfuAuthErrorCodes.UNKNOWN_ERROR:
            default:
                console.error(JSON.stringify(error));
            }
            break;
        case "TokenMismatchError":
            if (this.onTokenMismatch) {
                this.onTokenMismatch();
            } else {
                console.error("TOKEN_MISMATCH not handled");
            }
            break;
        case "MissingAuthenticationError":
            if (this.onMissingAuthenticationToken) {
                this.onMissingAuthenticationToken();
            } else {
                console.error("MISSING_AUTHENTICATION_ERROR not handled");
            }
            break;
        case "MissingAuthorizationError":
            if (this.onMissingAuthorizationToken) {
                this.onMissingAuthorizationToken();
            } else {
                console.error("MISSING_AUTHORIZATION_ERROR not handled");
            }
            break;
        default:
            console.error(JSON.stringify(error));
        }
    }

    private readonly sfus = new Map<SfuId, SFU>();

    public sfu(id: SfuId) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            const url = this.getSfuUrl(id);
            sfu = new SFU(id, url);
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
}

const microphoneGetter = (
    getAudioConstraints?: () => MediaStreamConstraints["audio"]
) => () => audioTrack(
    navigator.mediaDevices.getUserMedia({
        audio: getAudioConstraints?.() || true,
    })
);

const cameraGetter = (
    getVideoConstraints?: () => MediaStreamConstraints["video"]
) => () => videoTrack(
    navigator.mediaDevices.getUserMedia({
        video: getVideoConstraints?.() || true,
    })
);

const screenshareGetter = (
    getConstraints?: () =>  DisplayMediaStreamConstraints|undefined
) => () => videoTrack(
    navigator.mediaDevices.getDisplayMedia(getConstraints?.())
);

export const audioTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getAudioTracks());
export const videoTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getVideoTracks());
export const firstTrack = (tracks: MediaStreamTrack[]) => {
    const track = tracks[0];
    if(!track) { throw new Error("Could not get media track"); }
    if(tracks.length > 1) { console.info(`Got ${tracks.length} media tracks, can only use 1`); }
    return track;
};

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = "KidsloopLiveWebRTC";
