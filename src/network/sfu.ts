import { types as MediaSoup, Device } from "mediasoup-client";
import { NewType } from "../types";
import { TransportState, WSTransport } from "../network/websocketTransport";
import { PromiseCompleter } from "../network/promiseCompleter";
import { Store } from "@reduxjs/toolkit";
import { Action } from "../redux/reducer";
import { webrtcActions } from "../redux/webrtc";
import { ExecuteOnce } from "../executeOnce";
import EventEmitter from "eventemitter3";
import { MergingMutex } from "../mergingMutex";

export type SfuId = NewType<string, "sfuId">
export const newSfuID = (id: string) => id as SfuId;

export type ProducerId = NewType<string, "producerId">
export const newProducerID = (id: string) => id as ProducerId;

export type ConsumerId = NewType<string, "consumerId">
export const newConsumerID = (id: string) => id as ConsumerId;

export type RequestId = NewType<string, "requestId">
export const newRequestID = (id: string) => id as RequestId;

export type RequestMessage = {
    id: RequestId,
    request: Request,
}

type Request = {
    getRouterRtpCapabilities?: unknown;
    createProducerTransport?: unknown;
    connectProducerTransport?: TransportConnectRequest;
    produceTrack?: ProduceTrackRequest;

    setRtpCapabilities?: MediaSoup.RtpCapabilities;
    createConsumerTransport?: unknown;
    connectConsumerTransport?: TransportConnectRequest;
    consumeTrack?: ConsumeTrackRequest;

    pause?: PauseRequest;
    pauseForEveryone?: PauseRequest;
    endRoom?: unknown;
}

type TransportConnectRequest = { dtlsParameters: MediaSoup.DtlsParameters };
type ProduceTrackRequest = { kind: MediaSoup.MediaKind, rtpParameters: MediaSoup.RtpParameters, name: string };
type ConsumeTrackRequest = { producerId: ProducerId };
type PauseRequest = { paused: boolean, id: ProducerId };

export type ResponseMessage = {
    response?: Response,

    sourcePauseEvent?: PauseEvent,
    broadcastPauseEvent?: PauseEvent,
    sinkPauseEvent?: PauseEvent,

    consumerClosed?: ProducerId,
    producerClosed?: ProducerId,

    consumerTransportClosed?: unknown,
    producerTransportClosed?: unknown,
}

type Response = {
    id: RequestId;
    error: string,
} | {
    id: RequestId;
    result: Result | void,
}

export type WebRtcTransportResult = {
    id: string,
    iceCandidates: MediaSoup.IceCandidate[],
    iceParameters: MediaSoup.IceParameters,
    dtlsParameters: MediaSoup.DtlsParameters,
    sctpParameters?: MediaSoup.SctpParameters,
}

type Result = {
    routerRtpCapabilities?: MediaSoup.RtpCapabilities;

    producerTransportCreated?: WebRtcTransportResult;
    producerCreated?: ProducerId;

    consumerTransportCreated?: WebRtcTransportResult;
    consumerCreated?: {
        id: ConsumerId,
        producerId: ProducerId,
        kind: MediaSoup.MediaKind,
        rtpParameters: MediaSoup.RtpParameters,
    },
}

export type PauseEvent = {
    producerId: ProducerId,
    paused: boolean
}

export class SFU {
    public async getTrack(producerId: ProducerId) {
        const track = this.tracks.get(producerId);
        if(track) { return track; }    
        return await this.consumeTrack(producerId); 
    }

    public async produceTrack(
        getTrack: () => Promise<MediaStreamTrack>,
        name: string
    ) {
        const producer: Producer = new Producer(
            await this.createProducer(getTrack, name),
            getTrack,
            (paused: boolean) => this.changeBroadcastState(producer.id,paused),
        );
        producer.on("locallyPaused", (id, p) => this.setPauseState(id, p));
        this.tracks.set(producer.id, producer);
        await this.setPauseState(producer.id, false);
        return producer;
    }

    public async consumeTrack(producerId: ProducerId) {
        if(this.tracks.has(producerId)) { throw new Error(`Can not create consumer for Track(${producerId})`); }
        const consumer: Consumer = new Consumer(
            this.createConsumer(producerId),
            (paused: boolean) => this.changeBroadcastState(consumer.id,paused),
        );
        consumer.on("locallyPaused", (id, p) => this.setPauseState(id, p));
        this.tracks.set(producerId, consumer);
        return consumer;
    }

    private readonly device = new Device();

    private readonly promiseCompleter = new PromiseCompleter<Result | void, string, RequestId>();
    private readonly ws: WSTransport;

    public constructor(
        public readonly id: SfuId,
        private readonly store: Store<unknown, Action>,
        public readonly url: string,
    ) {
        this.ws = new WSTransport(
            url,
            (_, d) => this.onTransportMessage(d),
            t => this.onTransportStateChange(t),
            ["live-sfu"],
            true,
            null,
        );
        this.ws.connect().catch(e => console.error(e));
    }
    
    private readonly tracks = new Map<ProducerId, Producer|Consumer>();


    private async createProducer(
        getTrack: () => Promise<MediaStreamTrack>,
        name: string
    ) {
        const producerTransport = await this.producerTransport();
        
        const track = await getTrack();
        const canProduce = this.device.canProduce(track.kind as MediaSoup.MediaKind);
        if (!canProduce) { console.warn(`It seems like the remote router is not ready or can not recieve '${track.kind}' tracks`); }
        return await producerTransport.produce({
            track,
            zeroRtpOnPause: true,
            disableTrackOnPause: true,
            appData: {name},
        });
    }

    private async createConsumer(producerId: ProducerId) {
        const consumerTransport = await this.consumerTransport();
        await this.sendRtpCapabilities();
        const response = await this.request({ consumeTrack: { producerId } });
        if (!response) { throw new Error(`Received empty response from SFU when trying to consume producerId(${producerId})`); }
        if (!response.consumerCreated) { throw new Error(`Received response without consumer parameters from SFU when trying to consume producerId(${producerId})`); }
        console.log(response);
        const consumer = await consumerTransport.consume(response.consumerCreated);
        await this.setPauseState(producerId, false);
        return consumer;
    }

    public async changeBroadcastState(id: ProducerId, paused: boolean) {
        return this.request({pauseForEveryone: {id, paused}});
    }

    public async setPauseState(id: ProducerId, paused: boolean) {
        console.log("setPauseState");
        return this.request({pause: {id, paused}});
    }

    @ExecuteOnce()
    private async consumerTransport() {
        await this.loadDevice();
        const response = await this.request({ createConsumerTransport: {} });
        if (!response) { throw new Error("Empty response from SFU"); }
        const { consumerTransportCreated } = response;
        if (!consumerTransportCreated) { throw new Error("Response from SFU does not contain consumer transport"); }
        
        const transport = this.device.createRecvTransport(consumerTransportCreated);
        transport.on("connect", ({ dtlsParameters }, success, error) => this.request({ connectConsumerTransport: { dtlsParameters } }).then(success, error));
        transport.on("connectionstatechange", (connectionState: MediaSoup.ConnectionState) => {
            const action = webrtcActions.setConsumerConnectionStatus({ id: this.id, connectionState });
            this.store.dispatch(action);
        });
        return transport;
    }

    @ExecuteOnce()
    private async producerTransport() {
        await this.loadDevice();
        const result = await this.request({ createProducerTransport: {} });
        if (!result) { throw new Error("Empty response from SFU"); }
        const { producerTransportCreated } = result;
        if (!producerTransportCreated) { throw new Error("Response from SFU does not contain producer transport"); }
        
        const transport = this.device.createSendTransport(producerTransportCreated);
        transport.on("connect", (connectProducerTransport, callback, error) => this.request({ connectProducerTransport }).then(callback, error));
        transport.on("produce", async (produceTrack, callback, error) => {
            try {
                // TODO: name?
                console.log("producer", produceTrack);
                const response = await this.request({ produceTrack });
                if(!response) { return error("Empty response from SFU"); }
                const { producerCreated } = response;
                if(!producerCreated) { return error("Empty response from SFU"); }
                callback({id: producerCreated});
            } catch(e) {
                error(e);
            }
        });
        transport.on("connectionstatechange", (connectionState: MediaSoup.ConnectionState) => {
            console.log("connectionstatechange", connectionState);
            const action = webrtcActions.setProducerConnectionStatus({ id: this.id, connectionState });
            this.store.dispatch(action);
        });
        return transport;
    }


    @ExecuteOnce()
    private async sendRtpCapabilities() {
        await this.request({ setRtpCapabilities: this.device.rtpCapabilities });
    }

    @ExecuteOnce()
    private async loadDevice() {
        const response = await this.request({ getRouterRtpCapabilities: {} });
        if (!response) { throw new Error("Empty routerRtpCapabilities response from SFU"); }
        const routerRtpCapabilities = response.routerRtpCapabilities;
        if (!routerRtpCapabilities) { throw new Error("Response from SFU does not contain routerRtpCapabilities"); }
        await this.device.load({ routerRtpCapabilities });
    }

    private async request(request: Request) {
        const id = this.generateRequestId();
        const message: RequestMessage = { id, request };
        await this.ws.send(JSON.stringify(message));
        return this.promiseCompleter.createPromise(id);
    }

    private _requestId = 0;
    private generateRequestId() { return `${this._requestId++}` as RequestId; }

    private onTransportStateChange(state: TransportState) {
        console.info(`Transport state changed to ${state}`);
    }

    private onTransportMessage(data: string | ArrayBuffer | Blob) {
        const message = SFU.parse(data);
        if (!message) {  return this.ws.disconnect(4400); }
        this.handleMessage(message).catch(e => console.error(e));
    }

    private static parse(data: string | ArrayBuffer | Blob): ResponseMessage | undefined {
        if (typeof data !== "string") { return; }
        if(data.length === 0) { return {}; }
        const response = JSON.parse(data.toString()) as ResponseMessage;
        if (typeof response !== "object" || !response) { return; }
        return response;
    }

    private async handleMessage(message: ResponseMessage) {
        try {
            if (message.response) { this.response(message.response); }

            if (message.sourcePauseEvent) { this.onSourcePaused(message.sourcePauseEvent); }
            if (message.broadcastPauseEvent) { this.onBroadcastPaused(message.broadcastPauseEvent); }
            if (message.sinkPauseEvent) { this.onSinkPaused(message.sinkPauseEvent); }

            if (message.consumerClosed) { this.closeTrack(message.consumerClosed); }
            if (message.producerClosed) { this.closeTrack(message.producerClosed); }
        } catch(e) {
            console.warn(e);
        }
    }

    private response(response: Response) {
        const { id } = response;
        if ("error" in response) {
            this.promiseCompleter.reject(id, response.error);
        } else {
            this.promiseCompleter.resolve(id, response.result);
        }
    }

    private closeTrack(producerId: ProducerId) {
        this.tracks.get(producerId)?.close();
        this.tracks.delete(producerId);
    }

    private onSourcePaused({ producerId, paused }: PauseEvent) { 
        const track = this.tracks.get(producerId);
        if(track instanceof Consumer) { track.sourceIsPaused = paused; }
    }
    private onBroadcastPaused({ producerId, paused }: PauseEvent) {
        const track = this.tracks.get(producerId);
        if(track) { track.broadcastIsPaused = paused; }
    }
    private onSinkPaused({ producerId, paused }: PauseEvent) {
        const track = this.tracks.get(producerId);
        console.log("onSinkPaused", track, producerId, paused);
        if(track instanceof Consumer) { track.sinkIsPaused = paused; }
    }
}

export abstract class Track {
    public abstract get id(): ProducerId;
    public abstract get kind(): "audio" | "video" | undefined;
    public abstract get track(): MediaStreamTrack | null | undefined;
    public abstract get locallyPaused(): boolean

    public abstract start(): Promise<void>;
    public abstract stop(): Promise<void>;
    public abstract close(): void;

    public get sourceIsPaused() { return this._sourceIsPaused; }
    public get broadcastIsPaused() { return this._broadcastIsPaused; }
    public get sinkIsPaused() { return this._sinkIsPaused; }

    public readonly on: EventEmitter<TrackEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly off: EventEmitter<TrackEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);

    protected readonly emitter = new EventEmitter<TrackEventMap>();
    protected _sourceIsPaused?: boolean;
    protected _broadcastIsPaused?: boolean;
    protected _sinkIsPaused?: boolean;

    public constructor(
        public readonly requestBroadcastStateChange: (paused: boolean) => Promise<void|Result>
    ) {
        console.log("track constructor");
    }
}

export class Producer extends Track {
    public get id() { return newProducerID(this.producer.id); }
    public get kind() { return this.producer.kind as "audio"|"video"; }
    public get track() { return this.producer.track; }
    public get locallyPaused() { return this.producer.paused; }

    public async start() {
        if(this.track?.readyState !== "live") {
            const track = await this.getTrack();
            await this.producer.replaceTrack({track});
        }
        if(this.producer.paused) {
            await this.producer.resume();
            this.emitter.emit("locallyPaused", this.id, false);
        }
    }

    public async stop() {
        if(!this.producer.paused) {
            await this.producer.replaceTrack({track: null});
            await this.producer.pause(); //Modifies p1c
            this.emitter.emit("locallyPaused", this.id, true);
        }
    }

    public close() { this.producer.close(); }

    public override get sourceIsPaused() { return this.producer.paused; }
    
    public override set broadcastIsPaused(pause: boolean) {
        if(this.broadcastIsPaused === pause) { return; }
        this.broadcastIsPaused = pause;
        this.emitter.emit("broadcastIsPaused", pause);
    }

    public constructor(
        private readonly producer: MediaSoup.Producer,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        requestBroadcastStateChange: (paused: boolean) => Promise<void|Result>
    ) {
        super(requestBroadcastStateChange);
        console.log("producer constructor", producer);
        producer.on("transportclose", () => console.log(`Producer(${producer.id})'s Transport closed`));
        producer.on("trackended", () => console.log(`Producer(${producer.id}) ended`));
    }
}

export class Consumer extends Track {
    public get id() {
        if(!this.consumer) {throw new Error("Consumer has not yet initialized."); }
        return newProducerID(this.consumer.producerId);
    }
    public get kind() { return this.consumer?.kind as "audio"|"video"|undefined; }
    public get track() { return this.consumer?.track; }
    public get locallyPaused() { return this.consumer?.paused || true; }
    
    public async start() {
        console.log("consumer start - await");
        const consumer = await this.consumerPromise;
        console.log("consumer start - for reals this time", consumer);

        if(!consumer.paused) { return; }
        await consumer.resume();
        console.log("consumer start - resume", consumer);
        this.emitter.emit("locallyPaused", this.id, false);
    }

    public async stop() {
        const consumer = await this.consumerPromise;
        
        if(consumer.paused) { return; }
        await consumer.pause();
        this.emitter.emit("locallyPaused", this.id, true);
    }

    public close() { this.consumer?.close(); }

    public override set sourceIsPaused(paused: boolean) {
        if(this.sourceIsPaused === paused) { return; }
        this._sourceIsPaused = paused;
        this.emitter.emit("sourceIsPaused", paused);
    }

    public override set broadcastIsPaused(pause: boolean) {
        if(this.broadcastIsPaused === pause) { return; }
        this._broadcastIsPaused = pause;
        this.emitter.emit("broadcastIsPaused", pause);
    }

    public override set sinkIsPaused(pause: boolean) {
        console.log("sinkIsPaused", this._sinkIsPaused, pause);
        if(this.sinkIsPaused === pause) { return; }
        this._sinkIsPaused = pause;
        if(this.consumer) {
            console.log("sinkIsPaused-emit", this.consumer?.paused, this._sinkIsPaused);
            this.emitter.emit("sinkIsPaused", pause);
        } else {
            this.consumerPromise.then(() => {
                console.log("sinkIsPaused-emit", this.consumer?.paused, this._sinkIsPaused);
                this.emitter.emit("sinkIsPaused", pause);
            });
        }
    }

    public constructor (
        consumer: Promise<MediaSoup.Consumer>,
        requestBroadcastStateChange: (paused: boolean) => Promise<void|Result>,
    ) {
        super(requestBroadcastStateChange);
        console.log("consumer constructor");
        this.consumerPromise = consumer.then(async consumer => {
            try {
                console.log("consume constructor async", consumer);
                this.consumer = consumer;
                consumer.on("transportclose", () => console.log(`Consumer(${consumer.id})'s transport closed`));
                consumer.on("trackended", () => console.log(`Consumer(${consumer.id}) ended`));
                this.start();
                return consumer;
            } catch(e) {
                console.log(e);
                throw e;
            }
        });
    }
    private consumerPromise: Promise<MediaSoup.Consumer>;
    private consumer?: MediaSoup.Consumer;
}

export type TrackEventMap = {
    close: () => void,

    locallyPaused: (id: ProducerId, paused: boolean) => void,
    
    sourceIsPaused: (paused: boolean) => void,
    broadcastIsPaused: (paused: boolean) => void,
    sinkIsPaused: (paused: boolean) => void,
}
