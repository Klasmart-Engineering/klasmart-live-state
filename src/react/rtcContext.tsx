import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU, SfuId } from "../network/sfu";
import { Room, TrackLocation } from "../network/room";

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
        public readonly endpoint: URL,
        public readonly sessionId?: string,
    ) {
        endpoint.protocol = endpoint.protocol === "https" ? "wss" : "ws";
        const wsEndpoint = new URL(endpoint);
        wsEndpoint.pathname += "room";
        this.room = new Room("ws://localhost:8002/room");
    }

    private readonly sfus = new Map<SfuId, SFU>();

    private sfu(id: SfuId) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            const url = this.getSfuUrl(id);
            sfu = new SFU(id, url);
            this.sfus.set(id, sfu);
        }
        return sfu;
    }

    private async selectSfu() {
        const id = await this.room.getSfuId();
        return this.sfu(id);
    }

    private getSfuUrl(id?: SfuId) { return `ws://localhost:8080/sfuid/${id}`;}
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
    getAudioContraints?: () => MediaStreamConstraints["audio"]
) => () => audioTrack(
    navigator.mediaDevices.getUserMedia({
        audio: getAudioContraints?.() || true,
    })
);

const cameraGetter = (
    getVideoContraints?: () => MediaStreamConstraints["video"]
) => () => videoTrack(
    navigator.mediaDevices.getUserMedia({
        video: getVideoContraints?.() || true,
    })
);

const screenCaptureGetter = (
    getContraints?: () =>  DisplayMediaStreamConstraints|undefined
) => createCache(
    () => navigator.mediaDevices.getDisplayMedia(getContraints?.()),
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
