import {Device, types as MediaSoup} from "mediasoup-client";
import {NewType} from "../types";
import {TransportState, WSTransport} from "../network/websocketTransport";
import {PromiseCompleter} from "../network/promiseCompleter";
import {Memoize} from "../memoize";
import EventEmitter from "eventemitter3";

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

    pausedSource?: PauseEvent,
    pausedGlobally?: PauseEvent,

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

export type Result = {
    routerRtpCapabilities?: MediaSoup.RtpCapabilities;

    producerTransportCreated?: WebRtcTransportResult;
    producerCreated?: {
        producerId: ProducerId,
        pausedGlobally: boolean,
    };

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
        const producer = this.producers.get(producerId);
        if(producer) { return producer; }

        const consumer = this.consumers.get(producerId);
        if(consumer) { return consumer; }

        return await this.consumeTrack(producerId);
    }

    public async produceTrack(
        getTrack: () => Promise<MediaStreamTrack>,
        name: string,
        sessionId?: string
    ) {
        const producer = await this.createProducer(getTrack, name, sessionId);
        await this.pause(producer.id, false);
        return producer;
    }

    public async consumeTrack(producerId: ProducerId) {
        if(this.producers.has(producerId)) { throw new Error(`Can not create consumer for Track(${producerId})`); }
        const consumerPromise = this.createConsumer(producerId);
        this.consumers.set(producerId, consumerPromise);
        return await consumerPromise;
    }

    private readonly device = new Device();

    private readonly promiseCompleter = new PromiseCompleter<Result | void, string, RequestId>();
    private readonly ws: WSTransport;
    private retryDelay = 1000;
    private retryAttempts = 0;
    // Whether we are producing tracks on the SFU.
    public get producer() {
        return this.producers.size > 0;
    }

    public constructor(
        public readonly id: SfuId,
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

    private readonly producerResolvers = new Map<ProducerId, {(producer:Producer):unknown}>();
    private readonly producers = new Map<ProducerId, Promise<Producer>>();
    private readonly consumers = new Map<ProducerId, Promise<Consumer>>();
    public emitter = new EventEmitter<SfuEventMap>();

    private async createProducer(
        getTrack: () => Promise<MediaStreamTrack>,
        name: string,
        sessionId?: string,
    ) {
        const producerTransport = await this.producerTransport();

        const track = await getTrack();
        const canProduce = this.device.canProduce(track.kind as MediaSoup.MediaKind);
        if (!canProduce) { console.warn(`It seems like the remote router is not ready or can not receive '${track.kind}' tracks`); }

        const mediaSoupProducer = await producerTransport.produce({
            track,
            zeroRtpOnPause: true,
            disableTrackOnPause: false,
            appData: {
                name,
                sessionId,
            },
        });
        const producer: Producer = new Producer(
            mediaSoupProducer,
            getTrack,
            (paused: boolean) => this.pause(producer.id, paused),
            (paused: boolean) => this.pauseGlobally(producer.id, paused),
        );
        const resolver = this.producerResolvers.get(producer.id);
        if(resolver) {
            this.producerResolvers.delete(producer.id);
            resolver(producer);
        } else {
            console.error(`Could not locate resolver while creating Producer(${producer.id})`);
        }
        return producer;
    }

    private async createConsumer(producerId: ProducerId) {
        const consumerTransport = await this.consumerTransport();
        await this.sendRtpCapabilities();
        const response = await this.request({ consumeTrack: { producerId } });
        if (!response) { throw new Error(`Received empty response from SFU when trying to consume producerId(${producerId})`); }
        if (!response.consumerCreated) { throw new Error(`Received response without consumer parameters from SFU when trying to consume producerId(${producerId})`); }
        console.log(response);
        const consumer = await consumerTransport.consume(response.consumerCreated);
        await this.pause(producerId, false);
        return new Consumer(
            consumer,
            (paused: boolean) => this.pause(producerId, paused),
            (paused: boolean) => this.pauseGlobally(producerId, paused),
        );
    }

    public async pauseGlobally(id: ProducerId, paused: boolean) {
        return await this.request({pauseForEveryone: {id, paused}});
    }

    public async pause(id: ProducerId, paused: boolean) {
        return await this.request({pause: {id, paused}});
    }

    private consumerTransport = Memoize(async () => {
        await this.loadDevice();
        const response = await this.request({ createConsumerTransport: {} });
        if (!response) { throw new Error("Empty response from SFU"); }
        const { consumerTransportCreated } = response;
        if (!consumerTransportCreated) { throw new Error("Response from SFU does not contain consumer transport"); }

        const transport = this.device.createRecvTransport(consumerTransportCreated);
        transport.on("connect", ({ dtlsParameters }, success, error) => this.request({ connectConsumerTransport: { dtlsParameters } }).then(success, error));
        return transport;
    });

    private producerTransport = Memoize(async () => {
        await this.loadDevice();
        const result = await this.request({ createProducerTransport: {} });
        if (!result) { throw new Error("Empty response from SFU"); }
        const { producerTransportCreated } = result;
        if (!producerTransportCreated) { throw new Error("Response from SFU does not contain producer transport"); }

        const transport = this.device.createSendTransport(producerTransportCreated);
        transport.on("connect", (connectProducerTransport, callback, error) => this.request({ connectProducerTransport }).then(callback, error));
        transport.on("produce", async (produceTrack, callback, error) => {
            try {
                const response = await this.request({ produceTrack });
                if(!response) { return error("No response from SFU"); }
                const { producerCreated } = response;
                if(!producerCreated) { return error("Empty response from SFU"); }
                const id = producerCreated.producerId;
                if(!id) { return error("Malformed response from SFU"); }
                const producerPromise = new Promise<Producer>(resolver => this.producerResolvers.set(id, resolver));
                this.producers.set(id, producerPromise);
                producerPromise.then(p => p.pausedGlobally = producerCreated.pausedGlobally);
                callback({id});
            } catch(e) {
                error(e);
            }
        });
        return transport;
    });


    private sendRtpCapabilities = Memoize(async () => {
        await this.request({ setRtpCapabilities: this.device.rtpCapabilities });
    });


    private loadDevice = Memoize(async () => {
        const response = await this.request({ getRouterRtpCapabilities: {} });
        if (!response) { throw new Error("Empty routerRtpCapabilities response from SFU"); }
        const routerRtpCapabilities = response.routerRtpCapabilities;
        if (!routerRtpCapabilities) { throw new Error("Response from SFU does not contain routerRtpCapabilities"); }
        await this.device.load({ routerRtpCapabilities });
    });

    private async request(request: Request) {
        const id = this.generateRequestId();
        const message: RequestMessage = { id, request };
        await this.ws.send(JSON.stringify(message));
        return this.promiseCompleter.createPromise(id);
    }

    private _requestId = 0;
    private generateRequestId() { return `${this._requestId++}` as RequestId; }

    private onTransportStateChange(state: TransportState) {
        switch (state) {
        case "error":
            console.info(`Transport state changed to ${state}`);
            this.emitter.emit("connectionError", new SfuConnectionError("Transport error", this.retryAttempts, this.id, this.producer));
            this.retryAttempts++;
            this.waitRetry().then(() => this.ws.connect().catch(e => console.error(e)));
            break;
        case "connected":
            console.info(`Transport state changed to ${state}`);
            this.retryAttempts = 0;
            break;
        default:
            console.info(`Transport state changed to ${state}`);
        }
    }

    private async waitRetry() {
        if (this.retryAttempts < 10) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        } else if (this.retryAttempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 3 * this.retryDelay));
        } else {
            await new Promise(resolve => setTimeout(resolve, 5 * this.retryDelay));
        }
    }

    private onTransportMessage(data: string | ArrayBuffer | Blob) {
        const message = this.parse(data);
        if (!message) {  return this.ws.disconnect(4400); }
        this.handleMessage(message).catch(e => console.error(e));
    }

    private parse(data: string | ArrayBuffer | Blob): ResponseMessage | undefined {
        if (typeof data !== "string") { return; }
        if(data.length === 0) { return {}; }
        const response = JSON.parse(data.toString());
        if (typeof response !== "object" || !response) { return; }
        if (response.code !== undefined && response.name !== undefined && response.message !== undefined) {
            this.emitter.emit("authError", <SfuAuthErrors>response);
            return;
        }
        return response as ResponseMessage;
    }

    private async handleMessage(message: ResponseMessage) {
        try {
            if (message.response) { this.response(message.response); }

            if (message.pausedSource) { await this.onSourcePaused(message.pausedSource); }
            if (message.pausedGlobally) { await this.onGloballyPaused(message.pausedGlobally); }

            if (message.consumerClosed) { await this.closeTrack(message.consumerClosed); }
            if (message.producerClosed) { await this.closeTrack(message.producerClosed); }
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

    private async closeTrack(producerId: ProducerId) {
        (await this.producers.get(producerId))?.close();
        this.producers.delete(producerId);

        (await this.consumers.get(producerId))?.close();
        this.consumers.delete(producerId);
    }

    private async onSourcePaused({ producerId, paused }: PauseEvent) {
        const consumer = await this.consumers.get(producerId);
        if(consumer) { consumer.pausedAtSource = paused; }
    }

    private async onGloballyPaused({ producerId, paused }: PauseEvent) {
        const producer = await this.producers.get(producerId);
        console.log(`Producer(${producer?.id}): Global pause (${producerId},${paused})`);
        if(producer) { producer.pausedGlobally = paused; }

        const consumer = await this.consumers.get(producerId);
        if(consumer) { consumer.pausedGlobally = paused; }
    }
}

export abstract class Track {
    public abstract get id(): ProducerId;
    public abstract get kind(): "audio" | "video" | undefined;
    public abstract get track(): MediaStreamTrack | null | undefined;

    public abstract start(): Promise<void>;
    public abstract stop(): Promise<void>;
    public abstract close(): void;

    public abstract get isMine(): boolean
    public abstract get pausedLocally(): boolean
    public abstract get pausedAtSource(): boolean | undefined

    protected _pausedGlobally?: boolean;
    public get pausedGlobally() { return this._pausedGlobally; }
    public set pausedGlobally(pause: boolean | undefined) {
        console.log("consumer set pausedGlobally", pause);
        if(this._pausedGlobally === pause) { return; }
        this._pausedGlobally = pause;
        this.emitter.emit("pausedGlobally", pause);
    }

    public readonly on: EventEmitter<TrackEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly off: EventEmitter<TrackEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);
    protected readonly emitter = new EventEmitter<TrackEventMap>();

    protected constructor(
        public readonly requestBroadcastStateChange: (paused: boolean) => Promise<void|Result>
    ) { }
}

export class Producer extends Track {
    public get id() { return newProducerID(this.producer.id); }
    public get kind() { return this.producer.kind as "audio"|"video"; }
    public get track() { return this.producer.track; }
    public override get isMine() { return true; }
    public override get pausedLocally() { return this.producer.paused; }
    public override get pausedAtSource() { return this.producer.paused; }

    public async start() {
        if(this.track?.readyState !== "live") {
            const track = await this.getTrack();
            await this.producer.replaceTrack({track});
        }
        await this.pause(false);
    }

    public async stop() {
        if(this.producer.track) {
            await this.producer.replaceTrack({track: null});
        }
        await this.pause(true);
    }

    public close() { this.producer.close(); }

    public constructor(
        private readonly producer: MediaSoup.Producer,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private notifyPause: (paused: boolean) => Promise<void|Result>,
        requestPauseGlobally: (paused: boolean) => Promise<void|Result>
    ) {
        super(requestPauseGlobally);
        console.log("producer constructor", producer);
        producer.on("transportclose", () => console.log(`Producer(${producer.id})'s Transport closed`));
        producer.on("trackended", () => console.log(`Producer(${producer.id}) ended`));
    }

    private async pause(paused: boolean) {
        await Promise.allSettled([
            this.notifyPause(paused),
            paused
                ? this.producer.pause()
                : this.producer.resume()
        ]);
        this.emitter.emit("pausedLocally", this.pausedLocally);
    }
}

export class Consumer extends Track {
    public get id() {
        if(!this.consumer) {throw new Error("Consumer has not yet initialized."); }
        return newProducerID(this.consumer.producerId);
    }
    public get kind() { return this.consumer.kind as "audio"|"video"|undefined; }
    public get track() { return this.consumer.track; }
    public override get isMine() { return false; }
    public override get pausedLocally() { return this.consumer.paused; }

    protected _pausedAtSource?: boolean;
    public get pausedAtSource() { return this._pausedAtSource; }
    public set pausedAtSource(paused: boolean | undefined) {
        console.log("consumer set pausedAtSource", paused);
        if(this._pausedAtSource === paused) { return; }
        this._pausedAtSource = paused;
        this.emitter.emit("pausedAtSource", paused);
    }

    public async start() { await this.pause(false); }
    public async stop() { await this.pause(true); }
    public close() { this.consumer.close(); }

    public constructor (
        private consumer: MediaSoup.Consumer,
        private notifyPause: (paused: boolean) => Promise<void|Result>,
        requestPauseGlobally: (paused: boolean) => Promise<void|Result>,
    ) {
        super(requestPauseGlobally);
        console.log("consumer constructor");
        consumer.on("transportclose", () => console.log(`Consumer(${consumer.id})'s transport closed`));
        consumer.on("trackended", () => console.log(`Consumer(${consumer.id}) ended`));
    }

    private async pause(paused: boolean) {
        if(this.pausedLocally === paused) { return; }
        await Promise.allSettled([
            this.notifyPause(paused),
            paused
                ? this.consumer.pause()
                : this.consumer.resume()
        ]);
        this.emitter.emit("pausedLocally", this.pausedLocally);
    }
}

export type TrackEventMap = {
    close: () => void,
    pausedAtSource: (paused: boolean | undefined) => void,
    pausedGlobally: (paused: boolean | undefined) => void,
    pausedLocally: (paused: boolean | undefined) => void,
}

type SfuAuthError = Error & {
    code: number;
}

export type AuthenticationError = SfuAuthError & {
    name: "AuthenticationError";
};

export type AuthorizationError = SfuAuthError & {
    name: "AuthorizationError";
};

export type TokenMismatchError = SfuAuthError & {
    name: "TokenMismatchError";
};

export type MissingAuthenticationError = SfuAuthError & {
    name: "MissingAuthenticationError";
};

export type MissingAuthorizationError = SfuAuthError & {
    name: "MissingAuthorizationError";
};

export type SfuAuthErrors = AuthenticationError | AuthorizationError | TokenMismatchError | MissingAuthenticationError | MissingAuthorizationError;

export class SfuConnectionError implements Error {
    public readonly name = "SfuConnectionError";
    constructor(
        public readonly message: string,
        public readonly retries: number,
        public readonly id: SfuId,
        public readonly producerError: boolean = false) {}
}

export type SfuEventMap = {
    authError: (error: SfuAuthErrors) => void,
    connectionError: (error: SfuConnectionError) => void,
}
