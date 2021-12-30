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
    public start = MergeConcurrentCalls(async () => {
        await this.stop.untilComplete();
        if(!this.context) {
            const sfu = this.getSfu();
            const track = await this.getTrack();
            this.context = {
                sfu,
                producer: await sfu.createProducer(track)
            };
        } else {
            const { producer } = this.context;
            if(!producer.track || producer.track.readyState === "ended") {
                const track = await this.getTrack();
                await producer.replaceTrack({track}).catch(e => console.error("failed to replace", e));
            }
            await this.pause(false);
        }
    });

    public stop = MergeConcurrentCalls(async () => {
        await this.start.untilComplete();
        if(!this.context) { return; }
        const { producer } = this.context;
        // producer.track?.stop();
        await producer.replaceTrack({track: null});
        await this.pause(true);
    });

    public get track() { return this.context?.producer.track; }

    public get isSending() { return Boolean(this.track && this.track.readyState === "live") ; }

    public get location(): TrackLocation|undefined {
        if(!this.context) { return; }
        const { sfu, producer } = this.context;
        return {
            sfuId: sfu.id,
            producerId: newProducerID(producer.id),
        }; 
    }

    public constructor(
        private readonly getSfu: () => SFU,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
    ) {}

    private context?: { sfu: SFU, producer: MediaSoup.Producer };

    private async pause(paused: boolean) {
        if(!this.context) { return; }
        const {sfu, producer} = this.context;
        if(producer.paused === paused) { return; }
        if(paused) { producer.pause(); } else { producer.resume(); }
        paused ? producer.pause() : producer.resume();
        const id = newProducerID(producer.id);
        await sfu.localPause(id, paused);
    }
}

export type TrackLocation = { sfuId: SfuID, producerId: ProducerID }

const microphoneGetter = (
    getAudioContraints?: () => MediaStreamConstraints["audio"]
) => 
    () => audioTrack(
        navigator.mediaDevices.getUserMedia({
            audio: getAudioContraints?.() || true,
        })
    );

const cameraGetter = (
    getVideoContraints?: () => MediaStreamConstraints["video"]
) =>
    () => videoTrack(
        navigator.mediaDevices.getUserMedia({
            video: getVideoContraints?.() || true,
        })
    );

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

const audioTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getAudioTracks());
const videoTrack = async (stream: Promise<MediaStream>) => firstTrack((await stream).getVideoTracks());
function firstTrack(tracks: MediaStreamTrack[]) {
    const track = tracks[0];
    if(!track) { throw new Error("Could not get media track"); }
    if(tracks.length > 1) { console.info(`Got ${tracks.length} media tracks, can only use 1`); }
    return track;
}

type Initializer<T> = {(reset: {(): void}):T}
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

function MergeConcurrentCalls<T>(f:{():Promise<T>}) {
    let pending: Promise<T> | undefined;
    function wrappedFunction() {
        if(pending) { return pending; }
        return f().finally(() => pending = undefined);
    }
    const untilComplete = async () => {
        while(pending !== undefined) {
            try {
                await pending;
            } catch {
                /*Don't pass on error*/
            }
        }
    };
    return Object.freeze(Object.assign(wrappedFunction, {untilComplete}));
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = "KidsloopLiveWebRTC";
