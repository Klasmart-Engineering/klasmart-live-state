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

    public async getTrack({sfuId, producerId}: TrackLocation) {
        return await this.sfu(sfuId).getTrack(producerId);
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
        try {
            if (error.producerError && error.retries > 10 && this.sfus.has(error.id)) {
                console.error(`Cannot seem to reliably connect to SFU(${error.id}), attempting to acquire a different sfu`);

                const sfu = this.sfus.get(error.id);
                await sfu?.close();
                this.sfus.delete(error.id);
                await this.selectProducerSfu(error.id);

                if (this.camera.sfuId === error.id) {
                    await this.camera.close();
                    await this.camera.start();
                }
                if (this.microphone.sfuId === error.id) {
                    await this.microphone.close();
                    await this.microphone.start();
                }
                if (this.screenshare.sfuId === error.id) {
                    await this.screenshare.close();
                    await this.screenshare.start();
                }
            }
        } catch (e) {
            console.error(e);
        }

        console.error(error);
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

    private sfu(id: SfuId) {
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

export class StreamSender {
    public async start() {
        await Promise.all([
            this.videoSender.start(),
            this.audioSender.start(),
        ]);
    }

    public async stop() {
        await Promise.all([
            this.videoSender.producer?.stop(),
            this.audioSender.producer?.stop(),
        ]);
    }

    public readonly videoSender = new TrackSender(
        this.getSfu,
        () => videoTrack(this.getStream()),
        `${this.name}-video`,
        this.sessionId,
    );

    public readonly audioSender = new TrackSender(
        this.getSfu,
        () => audioTrack(this.getStream()),
        `${this.name}-audio`,
        this.sessionId,
    );

    private readonly getStream: () => Promise<MediaStream>;
    public constructor(
        private readonly getSfu: () => Promise<SFU>,
        getStream: () => Promise<MediaStream>,
        private readonly name: string,
        private readonly sessionId?: string | undefined,
    ) {
        this.getStream = createCache(
            getStream,
            s => s.getTracks().some(t => t.readyState === "ended"),
        );
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

function createCache<T>(initializeCache: {():Promise<T>|T}, checkValidity?:{(value: T):boolean}): {():Promise<T>} {
    let cache: {value: Promise<T>|T}|undefined;
    return async () => {
        try {
            if(cache) {
                const value = await cache.value;
                if(!checkValidity || checkValidity(value)) {
                    return value;
                }
            }
            cache = {value: initializeCache()};
            return cache.value;
        } catch (e) {
            cache = undefined;
            throw e;
        }
    };
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = "KidsloopLiveWebRTC";
