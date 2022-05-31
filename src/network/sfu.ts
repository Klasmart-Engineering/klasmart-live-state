import {Device, types as MediaSoup} from "mediasoup-client";
import {NewType} from "../types";
import {TransportState, WSTransport} from "./websocketTransport";
import {PromiseCompleter} from "./promiseCompleter";
import {Memoize} from "../memoize";
import EventEmitter from "eventemitter3";
import { BuiltinHandlerName } from "mediasoup-client/lib/Device";
import {Consumer, Producer} from "./track";
import { RtpEncodingParameters } from "mediasoup-client/lib/RtpParameters";

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
    clientId?: ClientId,
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

export type ClientId = NewType<string, "ClientId">;
export function newClientId(id: string) { return id as ClientId; }

export type ProducerParameters = {
    track: MediaStreamTrack,
    encodings?: RtpEncodingParameters[],
}

export type TrackState = {
    producerId: ProducerId;
    kind: "audio" | "video" | undefined;
    isMine: boolean,
    isPausedLocally: boolean;
    isPausedGlobally: boolean;
    isPausedAtSource: boolean;
}

export type DerivedTrackState = TrackState & {
    isConsumable: boolean;
}

export class SFU {
    private _requestId = 0;
    /**
     * SFU-68: Camera is turned off by default and can not turn on even though permissions are enabled.
     * Have to add the handleName "Safari12" to solve the issue "UnsupportedError, device is not supported" on Cordova iOS.
     * The WEBRTC_DEVICE_HANDLER_NAME would be got from kidsloop-live-frontend while building.
     * Refer: https://githubhot.com/repo/versatica/mediasoup-client/issues/188
    */
    private readonly device = new Device({handlerName: process.env["WEBRTC_DEVICE_HANDLER_NAME"] as BuiltinHandlerName});
    private readonly promiseCompleter = new PromiseCompleter<Result | void, string, RequestId>();
    private readonly ws: WSTransport;
    private retryDelay = 1000;
    private retryAttempts = 0;
    private retryMaxAttempts = 30;
    private retryTimer?: NodeJS.Timeout;
    private readonly producerResolvers = new Map<ProducerId, {(producer:Producer):unknown}>();
    private readonly producers = new Map<ProducerId, Promise<Producer>>();
    private readonly consumers = new Map<ProducerId, Promise<Consumer>>();
    public emitter = new EventEmitter<SfuEventMap>();

    public onTrackUpdate = (id: ProducerId, f: {(id: ProducerId):unknown}) => { this.trackUpdateEmitter.on(id, () => f(id)); };
    public offTrackUpdate = (id: ProducerId, f: {(id: ProducerId):unknown}) => { this.trackUpdateEmitter.off(id, () => f(id)); };
    private trackUpdateEmitter = new EventEmitter<Record<ProducerId,[]>>();

    public trackStates = new Map<ProducerId, DerivedTrackState>();
    public updateTrackState(producerId: ProducerId, stateChange: Partial<TrackState> | null) {
        if (stateChange === null) {
            this.trackStates.delete(producerId);
            this.emitUpdateTrackStateEvent();
            if (process.env["NODE_ENV"] === "development") {
                console.table(Array.from(this.trackStates.values()));
            }
            return this.trackStates;
        }
        function deriveState(state: TrackState): DerivedTrackState {
            const isActiveLocally = state.isPausedLocally === false;
            const isActiveAtProducer = state.isPausedAtSource === false;
            const isActiveGlobally = isActiveAtProducer && state.isPausedGlobally === false;
            return {
                ...state,
                isConsumable: isActiveGlobally && isActiveLocally,
            };
        }
        const initialState = {
            producerId: producerId,
            isPausedLocally: false,
            isPausedGlobally: false,
            isPausedAtSource: false,
        };
        const state = this.trackStates.get(producerId);
        const newState = state
            ? deriveState({ ...state, ...stateChange } as TrackState)
            : deriveState({ ...initialState, ...stateChange } as TrackState);
        this.trackStates.set(producerId, newState);
        this.emitUpdateTrackStateEvent();
        if (process.env["NODE_ENV"] === "development") {
            console.table(Array.from(this.trackStates.values()));
        }
        return this.trackStates;
    }

    public emitUpdateTrackStateEvent() {
        this.emitter.emit("trackStatesUpdate", Array.from(this.trackStates.values()));
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

    private generateRequestId() { return `${this._requestId++}` as RequestId; }

    public async getTrack(producerId: ProducerId) {
        const producer = this.producers.get(producerId);
        if(producer) { return producer; }

        const consumer = this.consumers.get(producerId);
        if(consumer) { return consumer; }

        return await this.consumeTrack(producerId);
    }

    public async produceTrack(
        getParameters: () => Promise<ProducerParameters>,
        name: string,
        sessionId?: string,
    ) {
        const producer = await this.createProducer(getParameters, name, sessionId,);
        await this.pause(producer.id, false);
        return producer;
    }

    public async consumeTrack(producerId: ProducerId) {
        if(this.producers.has(producerId)) { throw new Error(`Can not create consumer for Track(${producerId})`); }
        const consumerPromise = this.createConsumer(producerId);
        this.consumers.set(producerId, consumerPromise);
        this.trackUpdateEmitter.emit(producerId);
        return await consumerPromise;
    }

    public get hasProducers() {
        return this.producers.size > 0;
    }

    public async close() {
        console.log(`Closing SFU ${this.id}`);
        this.ws.disconnect();
        this.clearRetries();
        const promises = [
            ...this.producers.values(),
            ...this.consumers.values(),
        ].map(async p => (await p).close());
        await Promise.allSettled(promises);

    }

    private clearRetries() {
        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = undefined;
            this.retryAttempts = 0;
        }
    }

    private async createProducer(
        getParameters: () => Promise<ProducerParameters>,
        name: string,
        sessionId?: string,
    ) {
        const producerTransport = await this.producerTransport();

        const { track, encodings } = await getParameters();
        const canProduce = this.device.canProduce(track.kind as MediaSoup.MediaKind);
        if (!canProduce) { console.warn(`It seems like the remote router is not ready or can not receive '${track.kind}' tracks`); }

        const mediaSoupProducer = await producerTransport.produce({
            track,
            encodings,
            zeroRtpOnPause: true,
            disableTrackOnPause: true,
            stopTracks: true,
            appData: {
                name,
                sessionId,
            },
        });
        const producer: Producer = new Producer(
            mediaSoupProducer,
            getParameters,
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
        this.updateTrackState(producer.id, producer.state);
        return producer;
    }

    private async createConsumer(producerId: ProducerId) {
        const consumerTransport = await this.consumerTransport();
        await this.sendRtpCapabilities();
        const response = await this.request({ consumeTrack: { producerId } });
        if (!response) { throw new Error(`Received empty response from SFU when trying to consume producerId(${producerId})`); }
        if (!response.consumerCreated) { throw new Error(`Received response without consumer parameters from SFU when trying to consume producerId(${producerId})`); }
        console.log(response);
        const mediaSoupConsumer = await consumerTransport.consume(response.consumerCreated);
        await this.pause(producerId, false);
        const consumer = new Consumer(
            mediaSoupConsumer,
            (paused: boolean) => this.pause(producerId, paused),
            (paused: boolean) => this.pauseGlobally(producerId, paused),
        );
        this.updateTrackState(consumer.id, consumer.state);
        return consumer;
    }

    public async pauseGlobally(id: ProducerId, paused: boolean, skipUpdateState = false) {
        if (!skipUpdateState) {
            this.updateTrackState(id, { isPausedGlobally: paused });
        }
        return await this.request({pauseForEveryone: {id, paused}});
    }

    public async pause(id: ProducerId, paused: boolean, skipUpdateState = false) {
        if (!skipUpdateState) {
            this.updateTrackState(id, { isPausedLocally: paused });
        }
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
                this.trackUpdateEmitter.emit(id);
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

    private onTransportStateChange(state: TransportState) {
        switch (state) {
        case "error":
            console.info(`Transport state changed to ${state}`);
            this.retryAttempts++;
            if (this.retryAttempts < this.retryMaxAttempts) {
                console.log(`id: ${this.id} retries: ${this.retryAttempts}/${this.retryMaxAttempts}`);
                this.emitter.emit("connectionError", new SfuConnectionError("Transport error", this.retryAttempts, this.id, this.hasProducers));
                this.waitRetry().then(() => this.ws.connect().catch(e => console.error(e)));
            }
            else {
                this.clearRetries();
                console.log("Max retry attempts reached, closing connection");
            }
            break;
        case "connected":
            console.info(`Transport state changed to ${state}`);
            this.clearRetries();
            break;
        default:
            console.info(`Transport state changed to ${state}`);
        }
    }

    private async waitRetry() {
        if (this.retryAttempts < 10) {
            await new Promise(resolve => this.retryTimer = setTimeout(resolve, this.retryDelay));
        } else if (this.retryAttempts < 20) {
            await new Promise(resolve => this.retryTimer = setTimeout(resolve, 3 * this.retryDelay));
        } else {
            await new Promise(resolve => this.retryTimer = setTimeout(resolve, 5 * this.retryDelay));
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
            if (message.clientId) { this.setClientId(message.clientId); }
            if (message.response) { this.response(message.response); }

            if (message.pausedSource) { await this.onSourcePaused(message.pausedSource); }
            if (message.pausedGlobally) { await this.onGloballyPaused(message.pausedGlobally); }

            if (message.consumerClosed) { await this.closeTrack(message.consumerClosed); }
            if (message.producerClosed) { await this.closeTrack(message.producerClosed); }
        } catch(e) {
            console.warn(e);
        }
    }

    private setClientId(clientId: ClientId) {
        this.ws.protocols = [
            ...this.ws.protocols.filter(p => !p.startsWith("clientId")),
            `clientId${clientId}`,
        ];
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
        console.log(`Producer(${producerId}): track closed`);
        (await this.producers.get(producerId))?.close();
        this.producers.delete(producerId);

        (await this.consumers.get(producerId))?.close();
        this.consumers.delete(producerId);

        this.updateTrackState(producerId, null);
    }

    private async onSourcePaused({ producerId, paused }: PauseEvent) {
        console.log(`Producer(${producerId}): Source pause (${producerId},${paused})`);
        const consumer = await this.consumers.get(producerId);
        if(consumer) {
            consumer.pausedAtSource = paused;
            paused ? await consumer.stop() : await consumer.start();
            this.updateTrackState(producerId, consumer.state);
        }
    }

    private async onGloballyPaused({ producerId, paused }: PauseEvent) {
        console.log(`Producer(${producerId}): Global pause (${producerId},${paused})`);
        const producer = await this.producers.get(producerId);
        if(producer) { 
            producer.pausedGlobally = paused;
            this.updateTrackState(producerId, producer.state);
        }

        const consumer = await this.consumers.get(producerId);
        if(consumer) {
            consumer.pausedGlobally = paused;
            this.updateTrackState(producerId, consumer.state);
        }
    }
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
    trackStatesUpdate: (state: DerivedTrackState[]) => void,
}

