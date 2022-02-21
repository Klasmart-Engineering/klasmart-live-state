import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU, SfuId, SfuError } from "../network/sfu";
import {Room, TrackLocation} from "../network/room";

const INVALID = 4400;
const EXPIRED = 4401;
const NOT_BEFORE = 4403;
const UNKNOWN_ERROR = 4500;

export class WebRtcManager {
    public microphoneConstraints?: MediaStreamConstraints["audio"];
    public readonly microphone = new TrackSender(
        () => this.selectSfu(),
        microphoneGetter(() => this.microphoneConstraints),
        "microphone",
        this.sessionId,
    );

    public cameraConstraints?: MediaStreamConstraints["video"];
    public readonly camera = new TrackSender(
        () => this.selectSfu(),
        cameraGetter(() => this.cameraConstraints),
        "camera",
        this.sessionId,
    );

    public screenCaptureConstraints?: DisplayMediaStreamConstraints;
    public readonly screenshare = new StreamSender(
        () => this.selectSfu(),
        screenCaptureGetter(() => this.screenCaptureConstraints),
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
    ) {
        if(baseEndpoint.protocol === "https:") { baseEndpoint.protocol = "wss:"; }
        if(baseEndpoint.protocol === "http:") { baseEndpoint.protocol = "ws:"; }
        const wsEndpoint = new URL(baseEndpoint.toString());
        wsEndpoint.pathname += "room";
        this.room = new Room(wsEndpoint.toString());
    }

    private onSfuError(error: SfuError) {
        switch (error.name) {
        case "AuthenticationError":
            switch (error.code){
            case INVALID:
                if (this.onAuthenticationInvalid) {
                    this.onAuthenticationInvalid();
                } else {
                    console.error("INVALID_AUTHENTICATION not handled");
                }
                break;
            case EXPIRED:
                if (this.onAuthenticationExpired) {
                    this.onAuthenticationExpired();
                } else {
                    console.error("EXPIRED_AUTHENTICATION not handled");
                }
                break;
            case NOT_BEFORE:
            case UNKNOWN_ERROR:
            default:
                console.error(JSON.stringify(error));
            }
            break;
        case "AuthorizationError":
            switch (error.code){
            case INVALID:
                if (this.onAuthorizationInvalid) {
                    this.onAuthorizationInvalid();
                } else {
                    console.error("INVALID_AUTHORIZATION not handled");
                }
                break;
            case EXPIRED:
                if (this.onAuthorizationExpired) {
                    this.onAuthorizationExpired();
                } else {
                    console.error("EXPIRED_AUTHORIZATION not handled");
                }
                break;
            case NOT_BEFORE:
            case UNKNOWN_ERROR:
            default:
                console.error(JSON.stringify(error));
            }
            break;
        }
    }

    private readonly sfus = new Map<SfuId, SFU>();

    private sfu(id: SfuId) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            const url = this.getSfuUrl(id);
            sfu = new SFU(id, url);
            sfu.emitter.on("error", this.onSfuError);
            this.sfus.set(id, sfu);
        }
        return sfu;
    }

    private async selectSfu() {
        const id = await this.room.getSfuId();
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
        await Promise.allSettled([
            this.videoSender.start(),
            this.audioSender.start(),
        ]);
    }

    public async stop() {
        await Promise.allSettled([
            this.videoSender.producer?.stop(),
            this.audioSender.producer?.stop(),
        ]);
    }

    public readonly videoSender = new TrackSender(
        this.getSfu,
        () => videoTrack(this.getStream()),
        "screenshare",
    );
    public readonly audioSender = new TrackSender(
        this.getSfu,
        () => audioTrack(this.getStream()),
        "screenshare",
    );

    public constructor(
        private readonly getSfu: () => Promise<SFU>,
        private readonly getStream: () => Promise<MediaStream>,
    ) {}
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

const screenCaptureGetter = (
    getConstraints?: () =>  DisplayMediaStreamConstraints|undefined
) => createCache(
    () => navigator.mediaDevices.getDisplayMedia(getConstraints?.()),
    s => s.getTracks().some(t => t.readyState === "ended"),
);

const audioTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getAudioTracks());
const videoTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getVideoTracks());
function firstTrack(tracks: MediaStreamTrack[]) {
    const track = tracks[0];
    if(!track) { throw new Error("Could not get media track"); }
    if(tracks.length > 1) { console.info(`Got ${tracks.length} media tracks, can only use 1`); }
    return track;
}

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
