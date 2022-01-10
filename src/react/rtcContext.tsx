import { Store } from "@reduxjs/toolkit";
import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU, SfuId, newSfuID } from "../network/sfu";
import { Action, State } from "../redux/reducer";
import { TrackLocation } from "./hooks/webrtc";

export class WebRtcManager {
    public microphoneConstraints?: MediaStreamConstraints["audio"];
    public readonly microphone = new TrackSender(
        () => this.sfu(),
        microphoneGetter(() => this.microphoneConstraints),
        "user",
    );
    
    public cameraConstraints?: MediaStreamConstraints["video"];
    public readonly camera = new TrackSender(
        () => this.sfu(),
        cameraGetter(() => this.cameraConstraints),
        "user",
    );

    public screenCaptureConstraints?: DisplayMediaStreamConstraints;
    public readonly screenshare = new StreamSender(
        () => this.sfu(),
        screenCaptureGetter(() => this.screenCaptureConstraints),
    );

    public async getTrack({sfuId, producerId}: TrackLocation) {
        return await this.sfu(sfuId).getTrack(producerId);
    }

    public async pauseForEveryone({sfuId, producerId}: TrackLocation, paused: boolean) {
        const sfu = this.sfus.get(sfuId);
        if(!sfu) {throw new Error(`Not connected to SFU(${sfuId})`); }
        await sfu.changeBroadcastState(producerId, paused);
    }

    public async pause({sfuId, producerId}: TrackLocation, paused: boolean) {
        const sfu = this.sfus.get(sfuId);
        if(!sfu) {throw new Error(`Not connected to SFU(${sfuId})`); }
        await sfu.setPauseState(producerId, paused);
    }

    public constructor(
        public readonly store: Store<unknown, Action>,
        public readonly selector: (s: unknown) => State,
        public readonly getUrl: (id: SfuId) => URL,
    ) {}

    private readonly sfus = new Map<SfuId, SFU>();

    private sfu(id: SfuId = newSfuID("test-sfu")) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            const url = this.getUrl(id).toString();
            sfu = new SFU(id, this.store, url);
            this.sfus.set(id, sfu);
        }
        return sfu;
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
        "screen",
    );
    public readonly audioSender = new TrackSender(
        this.getSfu,
        () => audioTrack(this.getStream()),
        "screen",
    );

    public constructor(
        private readonly getSfu: () => SFU,
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
