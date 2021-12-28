import { Store } from "@reduxjs/toolkit";
import React from "react";
import { ProducerID, SFU, SfuID, newSfuID, newProducerID } from "../network/sfu";
import { Action, State } from "../redux/reducer";
import { types as MediaSoup } from "mediasoup-client";

export class WebRtcManager {
    public async getTrack({sfuId: sfu, producerId: producer}: TrackLocation) {
        return await this.sfu(sfu).getTrack(producer);
    }

    public microphoneConstraints?: MediaStreamConstraints["audio"];
    public readonly microphone = new TrackSender(
        () => this.sfu(),
        microphoneGetter(() => this.microphoneConstraints),
    );
    
    public cameraConstraints?: MediaStreamConstraints["video"];
    public readonly camera = new TrackSender(
        () => this.sfu(),
        cameraGetter(() => this.cameraConstraints),
    );

    public screenCaptureConstraints?: DisplayMediaStreamConstraints;
    public readonly screenshare = new StreamSender(
        () => this.sfu(),
        screenCaptureGetter(() => this.screenCaptureConstraints),
    );

    public async globalPause({sfuId, producerId}: TrackLocation, paused: boolean) {
        const sfu = this.sfus.get(sfuId);
        if(!sfu) {throw new Error(`Not connected to SFU(${sfuId})`); }
        await sfu.globalPause(producerId, paused);
    }

    public async localPause({sfuId, producerId}: TrackLocation, paused: boolean) {
        const sfu = this.sfus.get(sfuId);
        if(!sfu) {throw new Error(`Not connected to SFU(${sfuId})`); }
        await sfu.localPause(producerId, paused);
    }

    public constructor(
        public readonly store: Store<unknown, Action>,
        public readonly selector: (s: unknown) => State,
        public readonly getUrl: (id: SfuID) => URL,
    ) {}

    private readonly sfus = new Map<SfuID, SFU>();

    private sfu(id: SfuID = newSfuID("test-sfu")) {
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
            this.videoSender.stop(), 
            this.audioSender.stop(),
        ]);
    }

    public readonly videoSender = new TrackSender(this.getSfu, () => videoTrack(this.getStream()));
    public readonly audioSender = new TrackSender(this.getSfu, () => audioTrack(this.getStream()));

    public constructor(
        private readonly getSfu: () => SFU,
        private readonly getStream: () => Promise<MediaStream>,
    ) {}
}

export class TrackSender {
    public async start() {
        const track = await this.getTrack();
        if(!this.context) {
            this.context = this.send(track);
        } else {
            const { producer, sfu } = await this.context;
            if(producer.track === track) { return; }
            await producer.replaceTrack({track});
            await TrackSender.pause(sfu, producer, false);
        }
    }

    public async stop() {
        if(!this.context) { return; }
        const { producer, sfu } = await this.context;
        producer.track?.stop();
        await producer.replaceTrack({track: null});
        await TrackSender.pause(sfu, producer, true);
    }

    public get location() { return this._location; }

    public constructor(
        private readonly getSfu: () => SFU,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
    ) {}

    private context?: Promise<{ sfu: SFU, producer: MediaSoup.Producer }>;
    private _location?: TrackLocation;
    private async send(track: MediaStreamTrack, sfu = this.getSfu()) {
        const producer = await sfu.createProducer(track);
        this._location = { sfuId: sfu.id, producerId: newProducerID(producer.id) };
        return { sfu, producer };
    }

    private static async pause(sfu: SFU, producer: MediaSoup.Producer, paused: boolean) {
        if(producer.paused !== paused) {
            const id = newProducerID(producer.id);
            await sfu.localPause(id, paused);
        }
    }
}

export type TrackLocation = { sfuId: SfuID, producerId: ProducerID }

function microphoneGetter(getAudioContraints?: () => MediaStreamConstraints["audio"]) {
    return createTrackCache(
        () => audioTrack(
            navigator.mediaDevices.getUserMedia({
                audio: getAudioContraints?.() || true,
            })
        )
    );
}

function cameraGetter(getVideoContraints?: () => MediaStreamConstraints["video"]) {
    return createTrackCache(
        () => videoTrack(
            navigator.mediaDevices.getUserMedia({
                video: getVideoContraints?.() || true,
            })
        )
    );
}

function screenCaptureGetter(getContraints?: () =>  DisplayMediaStreamConstraints|undefined) {
    return createCache(async (clearCache) => {
        try {
            const contraints = getContraints?.();
            const stream = await navigator.mediaDevices.getDisplayMedia(contraints);
            stream.getTracks().forEach(t => t.addEventListener("ended", clearCache));
            return stream;
        } catch (e) {
            clearCache();
            throw e;
        }
    });
}

function createTrackCache(getTrack: () => Promise<MediaStreamTrack>) {
    return createCache(async (clearCache) => {
        try {
            const track = await getTrack();
            track.addEventListener("ended", clearCache);
            return track;
        } catch (e) {
            clearCache();
            throw e;
        }
    });
}

const audioTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getAudioTracks());
const videoTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getVideoTracks());
function firstTrack(tracks: MediaStreamTrack[]) {
    const track = tracks[0];
    if(!track) { throw new Error("Could not get media track"); }
    if(tracks.length > 1) { console.log(`Got ${tracks.length} media tracks, can only use 1`); }
    return track;
}

type Initializer<T> = {(invalidateCache: {(): void}):T}
function createCache<T>(initializeCache: Initializer<T> ): {():T} {
    let cache: T|undefined;
    let id = 0;
    return () => {
        if(cache === undefined) {
            const invalidationId = id += 1;
            const invalidateCache = () => {
                if(invalidationId === id) { cache = undefined; }
            };
            cache = initializeCache(invalidateCache);
        }
        return cache;
    };
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = "KidsloopLiveWebRTC";
