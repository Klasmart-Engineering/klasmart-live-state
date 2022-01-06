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

export type TrackLocation = { sfuId: SfuId, producerId: ProducerId }
export class SFU {
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
    
    private readonly states = new Map<ProducerId, ProducerStateRemote|ConsumerStateRemote>();
    public async createProducer(track: MediaStreamTrack, name: string) {
        const producerTransport = await this.producerTransport();
        const canProduce = this.device.canProduce(track.kind as MediaSoup.MediaKind);
        if (!canProduce) { console.warn(`It seems like the remote router is not ready or can not recieve '${track.kind}' tracks`); }
        
        const producer = await producerTransport.produce({
            track,
            zeroRtpOnPause: true,
            disableTrackOnPause: true,
            appData: name,
        });
        
        const state = new ProducerStateRemote(
            producer,
            (id: ProducerId, paused: boolean) => this.changeBroadcastState(id,paused)
        );
        this.states.set(state.id, state);
        state.on("locallyPaused", (id, p) => this.setPauseState(id, p));

        await this.setPauseState(state.id, false);

        return state.getObserver();
    }

    private async createConsumer(producerId: ProducerId) {
        {
            const state = this.states.get(producerId);
            if(state instanceof ProducerState) { throw new Error("Can not consume a track that is produced locally"); }
            if(state instanceof ConsumerStateRemote) { return state; }
        }
        const state = new ConsumerStateRemote();
        this.states.set(producerId, state);
        state.on("locallyPaused", (id, p) => this.setPauseState(id, p));

        const consumerTransport = await this.consumerTransport();
        await this.sendRtpCapabilities();
        const response = await this.request({ consumeTrack: { producerId } });
        if (!response) { throw new Error(`Received empty response from SFU when trying to consume producerId(${producerId})`); }
        if (!response.consumerCreated) { throw new Error(`Received response without consumer parameters from SFU when trying to consume producerId(${producerId})`); }
        
        state.consumer = await consumerTransport.consume(response.consumerCreated);
        await this.setPauseState(producerId, false);
        return state.getObserver();
    }

    public async changeBroadcastState(id: ProducerId, paused: boolean) {
        return this.request({pauseForEveryone: {id, paused}});
    }

    public async setPauseState(id: ProducerId, paused: boolean) {
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
                console.log(produceTrack);
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
        this.states.get(producerId)?.close();
        this.states.delete(producerId);
    }

    private onSourcePaused({ producerId, paused }: PauseEvent) { 
        const state = this.states.get(producerId);
        if(state instanceof ConsumerStateRemote) { state.sourceIsPaused = paused; }
    }
    private onBroadcastPaused({ producerId, paused }: PauseEvent) {
        const state = this.states.get(producerId);
        if(state) { state.broadcastIsPaused = paused; }
    }
    private onSinkPaused({ producerId, paused }: PauseEvent) {
        const state = this.states.get(producerId);
        if(state instanceof ConsumerStateRemote) { state.sinkIsPaused = paused; }
    }
}

export class ProducerState {
    public get track() { return this._producer.track; }
    public get id() { return newProducerID(this._producer.id); }
    public get sourceIsPaused() { return this._producer.paused; }
    public get broadcastIsPaused() { return this._broadcastIsPaused; }

    public readonly on: EventEmitter<ProducerStateEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly off: EventEmitter<ProducerStateEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);

    public start = MergingMutex(async (
        getTrack: () => Promise<MediaStreamTrack>,
    ) => {
        await this.stop.waitUntilUnlock();
        if(this.track?.readyState !== "live") {
            await this._producer.replaceTrack({track: await getTrack()});
        }
        if(this._producer.paused) {
            await this._producer.resume();
            this.emitter.emit("locallyPaused", this.id, false);
        }
    });

    public stop = MergingMutex(async () => {
        await this.start.waitUntilUnlock();
        if(!this._producer.paused) {
            await this._producer.replaceTrack({track: null});
            await this._producer.pause();
            this.emitter.emit("locallyPaused", this.id, true);
        }
    });

    public constructor(
        protected readonly _producer: MediaSoup.Producer,
        public readonly requestBroadcastStateChange: (id: ProducerId, paused: boolean) => Promise<void|Result>
    ) {
        _producer.on("transportclose", () => console.log(`Producer(${_producer.id})'s Transport closed`));
        _producer.on("trackended", () => console.log(`Producer(${_producer.id}) ended`));
    }
    
    protected getState() { return this; }
    protected readonly emitter = new EventEmitter<ProducerStateEventMap>();
    protected _broadcastIsPaused?: boolean;
}


class ProducerStateRemote extends ProducerState {
    public getObserver() { return this.getState(); }

    public close() { this._producer.close(); }
    
    public override set broadcastIsPaused(pause: boolean) {
        if(this.broadcastIsPaused === pause) { return; }
        this.broadcastIsPaused = pause;
        this.emitter.emit("broadcastIsPaused", pause);
    }
}

export type ProducerStateEventMap = {
    close: () => void,

    locallyPaused: (id: ProducerId, paused: boolean) => void,

    broadcastIsPaused: (paused: boolean) => void,
}

export class ConsumerState {
    public get consumer() { return this._consumer; }
    public get id() {
        if(!this._consumer) {throw new Error("Consumer has not yet initialized."); }
        return newProducerID(this._consumer.producerId);
    }
    
    public get sourceIsPaused() { return this._sourceIsPaused; }
    public get broadcastIsPaused() { return this._broadcastIsPaused; }
    public get sinkIsPaused() { return this._sinkIsPaused; }

    public async start() {
        if(!this._consumer || !this._consumer.paused) { return; }
        await this._consumer.resume();
        this.emitter.emit("locallyPaused", this.id, false);
    }

    public readonly on: EventEmitter<ConsumerStateEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly off: EventEmitter<ConsumerStateEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);

    protected getState() { return this; }
    protected readonly emitter = new EventEmitter<ConsumerStateEventMap>();
    protected _consumer?: MediaSoup.Consumer;
    protected _sourceIsPaused?: boolean;
    protected _broadcastIsPaused?: boolean;
    protected _sinkIsPaused?: boolean;
}

export class ConsumerStateRemote extends ConsumerState {
    public getObserver() { return this.getState(); }
    
    public close() { this.consumer.close(); }

    public override set consumer(consumer: MediaSoup.Consumer) {
        if(this.consumer) { throw new Error(`ConsumerState.Consumer(${this.id}) is already set`); }
        this._consumer = consumer;
        consumer.on("transportclose", () => console.log(`Consumer(${consumer.id})'s transport closed`));
        consumer.on("trackended", () => console.log(`Consumer(${consumer.id}) ended`));
    }

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
        if(this.sinkIsPaused === pause) { return; }
        this._sinkIsPaused = pause;
        this.emitter.emit("sinkIsPaused", pause);
    }
}

export type ConsumerStateEventMap = {
    close: () => void,

    locallyPaused: (id: ProducerId, paused: boolean) => void,
    
    sourceIsPaused: (paused: boolean) => void,
    broadcastIsPaused: (paused: boolean) => void,
    sinkIsPaused: (paused: boolean) => void,
}
