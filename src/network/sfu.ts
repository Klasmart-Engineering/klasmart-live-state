import {Device, types as MediaSoup} from "mediasoup-client";
import {NetworkTransportState, NetworkTransport} from "./networkTransport";
import {PromiseCompleter} from "./promiseCompleter";
import {Memoize} from "../memoize";
import EventEmitter from "eventemitter3";
import { BuiltinHandlerName } from "mediasoup-client/lib/Device";
import {Consumer, Producer} from "./track";
import {Mutex, MutexInterface, withTimeout} from "async-mutex";
import {
    ProducerId,
    ProducerParameters,
    RequestId,
    RequestMessage,
    Result,
    SfuId,
    Request,
    ResponseMessage,
    Response, ClientId, PauseEvent, SfuEventMap, SfuConnectionError, SfuAuthErrors, newProducerID
} from "./sfuTypes";
import {Room} from "./room";

const MUTEX_TIMEOUT = 20000;

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
    private readonly ws: NetworkTransport;
    private retryTimer?: NodeJS.Timeout;
    private readonly producerResolvers = new Map<ProducerId, {(producer:Producer):unknown}>();
    private _producerTransport?: MediaSoup.Transport;
    private _consumerTransport?: MediaSoup.Transport;
    private readonly producers = new Map<ProducerId, Promise<Producer>>();
    private readonly consumers = new Map<ProducerId, Promise<Consumer>>();
    public emitter = new EventEmitter<SfuEventMap>();
    private readonly producerTransportLock = withTimeout(new Mutex(new Error("ProducerTransportLock")), MUTEX_TIMEOUT, new Error("ProducerTransportLock"));
    private readonly consumerTransportLock = withTimeout(new Mutex(new Error("ConsumerTransportLock")), MUTEX_TIMEOUT, new Error("ConsumerTransportLock"));
    private readonly createTrackLock = withTimeout(new Mutex(new Error("CreateTrackLock")), MUTEX_TIMEOUT, new Error("CreateTrackLock"));
    private readonly pauseLocks = new Map<ProducerId, MutexInterface>();
    private trackUpdateEmitter = new EventEmitter<Record<ProducerId,[]>>();

    public constructor(
        public readonly id: SfuId,
        public readonly url: string,
        private readonly room: Room,
        private retryDelay = 1000,
        private retryAttempts = 0,
        private retryMaxAttempts = 10,
    ) {
        this.ws = new NetworkTransport(
            url,
            ["live-sfu"],
            true,
            null,
        );
        this.ws.on("statechange", (s) => this.onTransportStateChange(s));
        this.ws.on("message", (d) => this.onTransportMessage(d));
        this.ws.connect().catch(e => console.error(e));
        this.room.on("trackRemoved", async (id) => {
            const consumer = await this.consumers.get(id);
            consumer?.close();
            this.consumers.delete(id);
        });
    }

    public onTrackUpdate(id: ProducerId, f: {(id: ProducerId):unknown}) {
        this.trackUpdateEmitter.on(id, () => f(id));
    }
    public offTrackUpdate(id: ProducerId, f: {(id: ProducerId):unknown}) {
        this.trackUpdateEmitter.off(id, () => f(id));
    }

    private generateRequestId() { return `${this._requestId++}` as RequestId; }

    public async getTrack(producerId: ProducerId) {
        console.log(`Getting track for Producer(${producerId})`);
        try {
            // Ensure we aren't in the process of creating a producer
            const producer = await this.createTrackLock.runExclusive(async () => {
                const producer = this.producers.get(producerId);
                if(producer) { return await producer; }
                return;
            });
            if (producer) return producer;

            const consumer = this.consumers.get(producerId);
            if(consumer) { return await consumer; }

            return await this.consumeTrack(producerId);
        } catch (e) {
            console.error(`Failed to getTrack(${producerId}): `, e);
        }
        return;
    }

    public async produceTrack(
        parameters: ProducerParameters,
        name: string,
        sessionId?: string,
    ) {
        const producerTransport = await this.producerTransport();
        const producer = await this.createProducer(parameters, name, producerTransport, sessionId);
        await this.pause(producer.id, false);
        return producer;
    }

    @SFU.createTrackLock()
    public async consumeTrack(producerId: ProducerId) {
        if (this.producers.has(producerId) || this.producerResolvers.has(producerId)) {
            console.error(`Cannot consume track ${producerId} because it is locally produced`);
            return;
        }
        if (this.consumers.has(producerId)) {
            console.error(`Cannot create consumer for Track(${producerId}), it is already being consumed`);
            return;
        }
        if (this.pauseLocks.has(producerId)) {
            console.error(`Cannot create consumer for Track(${producerId}), it is already being created`);
            return;
        }

        this.pauseLocks.set(producerId, withTimeout(new Mutex(new Error(`PauseLock: ${producerId}`)), MUTEX_TIMEOUT, new Error(`PauseLock: ${producerId}`)));

        console.log(`Consuming track ${producerId}`);
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

    @SFU.createTrackLock()
    @SFU.producerTransportLock()
    private async createProducer(
        parameters: ProducerParameters,
        name: string,
        producerTransport: MediaSoup.Transport,
        sessionId?: string,
    ) {
        // Ensure we do not try to consume any other tracks before this completes
        const {track, encodings} = parameters;
        const canProduce = this.device.canProduce(track.kind as MediaSoup.MediaKind);
        if (!canProduce) {
            console.warn(`It seems like the remote router is not ready or can not receive '${track.kind}' tracks`);
        }

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
        console.log(`Created producer ${mediaSoupProducer.id}`);
        try {
            // Ensure we are not currently trying to use this producer
            return this.pauseLocks.get(newProducerID(mediaSoupProducer.id))!.runExclusive(async () => {
                console.log(`Acquire PauseLock(${mediaSoupProducer.id}), createProducer`);
                const producer: Producer = new Producer(
                    mediaSoupProducer,
                    parameters,
                    producerTransport
                );

                producer.on("pausedLocally", (paused) => {
                    if (paused !== undefined) this.pause(producer.id, paused);
                });
                producer.on("pausedAtSource", (paused) => {
                    if (paused !== undefined) this.pause(producer.id, paused);
                });
                producer.on("pausedGlobally", (paused) => {
                    if (paused !== undefined) this.pauseGlobally(producer.id, paused);
                });
                producer.on("close", () => {
                    this.producers.delete(producer.id);
                    this.pauseLocks.delete(producer.id);
                });

                this.resolveProducer(producer);
                return producer;
            });
        } finally {
            console.log(`Release PauseLock(${mediaSoupProducer.id}), createProducer`);
        }
    }

    private resolveProducer(producer: Producer) {
        const resolver = this.producerResolvers.get(producer.id);
        if (resolver) {
            this.producerResolvers.delete(producer.id);
            resolver(producer);
            return;
        }
        return console.error(`Could not locate resolver while creating Producer(${producer.id})`);
    }

    private async createConsumer(producerId: ProducerId) {
        const consumerTransport = await this.consumerTransport();
        await this.sendRtpCapabilities();
        const response = await this.request({ consumeTrack: { producerId } });
        if (!response) { throw new Error(`Received empty response from SFU when trying to consume producerId(${producerId})`); }
        if (!response.consumerCreated) { throw new Error(`Received response without consumer parameters from SFU when trying to consume producerId(${producerId})`); }
        console.log(response);
        const mediasoupConsumer = await consumerTransport.consume(response.consumerCreated);
        await this.pause(producerId, false);
        const consumer =  new Consumer(
            mediasoupConsumer,
            consumerTransport
        );
        consumer.on("pausedLocally", (paused) => {
            if (paused !== undefined) this.pause(producerId, paused);
        });
        consumer.on("pausedAtSource", (paused) => {
            if (paused !== undefined) this.pause(producerId, paused);
        });
        consumer.on("pausedGlobally", (paused) => {
            if (paused !== undefined) this.pauseGlobally(producerId, paused);
        });
        consumer.on("close", () => {
            this.consumers.delete(producerId);
            this.pauseLocks.delete(producerId);
        });
        return consumer;
    }

    public async pauseGlobally(id: ProducerId, paused: boolean) {
        try {
            return await this.pauseLocks.get(id)?.runExclusive(async () => {
                console.log(`Acquire PauseLock(${id}), pauseGlobally`);
                return await this.request({pauseForEveryone: {id, paused}});
            });
        } finally {
            console.log(`Release PauseLock(${id}), pauseGlobally`);
        }
    }

    public async pause(id: ProducerId, paused: boolean) {
        try {
            return await this.pauseLocks.get(id)?.runExclusive(async () => {
                console.log(`Acquire PauseLock(${id}), pause`);
                return await this.request({pause: {id, paused}});
            });
        } finally {
            console.log(`Release PauseLock(${id}), pause`);
        }
    }

    @SFU.consumerTransportLock()
    private async consumerTransport() {
        // Check transport status, return existing transport if it's ok
        if ((this._consumerTransport && this._consumerTransport.connectionState === "connected") ||
                    (this._consumerTransport && this._consumerTransport.connectionState === "connecting") ||
                    (this._consumerTransport && this._consumerTransport.connectionState === "new")) {
            return this._consumerTransport;
        }
        // Transport state not ok, create new consumer transport
        const transport = await this.createConsumerTransport();
        this._consumerTransport = transport;
        return transport;
    }

    private async createConsumerTransport() {
        await this.loadDevice();
        const response = await this.request({ createConsumerTransport: {} });
        if (!response) { throw new Error("Empty response from SFU"); }
        const { consumerTransportCreated } = response;
        if (!consumerTransportCreated) { throw new Error("Response from SFU does not contain consumer transport"); }

        const transport = this.device.createRecvTransport(consumerTransportCreated);
        transport.on("connect", ({ dtlsParameters }, success, error) => this.request({ connectConsumerTransport: { dtlsParameters } }).then(success, error));
        return transport;
    }

    @SFU.producerTransportLock()
    private async producerTransport() {
        // Check transport status, return existing transport if it's ok
        if ((this._producerTransport && this._producerTransport.connectionState === "connected") ||
            (this._producerTransport && this._producerTransport.connectionState === "connecting") ||
            (this._producerTransport && this._producerTransport.connectionState === "new")) {
            return this._producerTransport;
        }
        // Transport state not ok, create new producer transport
        const transport = await this.createProducerTransport();
        this._producerTransport = transport;
        return transport;
    }

    private async createProducerTransport() {
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
                console.log(`NumProducers: ${this.producers.size}`);
                if (!this.pauseLocks.has(id)) this.pauseLocks.set(id, withTimeout(new Mutex(new Error(`PauseLock: ${id}`)), MUTEX_TIMEOUT, new Error(`PauseLock: ${id}`)));

                this.trackUpdateEmitter.emit(id);
                producerPromise.then(p => p.pausedGlobally = producerCreated.pausedGlobally);
                callback({id});
            } catch(e) {
                error(e);
            }
        });
        return transport;
    }

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

    private retry() {
        if (this.retryAttempts > this.retryMaxAttempts) {
            console.log("Max retry attempts reached");
            return;
        }
        console.log(`id: ${this.id} retries: ${this.retryAttempts}/${this.retryMaxAttempts}`);
        this.emitter.emit("connectionError", new SfuConnectionError("Transport error", this.retryAttempts, this.id, this.hasProducers));
        this.retryAttempts++;

        this.waitRetry().then(() => this.ws.connect().catch(e => console.error(e)));
    }

    private onTransportStateChange(state: NetworkTransportState) {
        switch (state) {
        case "error":
            console.info(`Transport state changed to ${state}`);
            this.retry();
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
            return await new Promise(resolve => this.retryTimer = setTimeout(resolve, this.retryDelay));
        }
        if (this.retryAttempts < 20) {
            return await new Promise(resolve => this.retryTimer = setTimeout(resolve, 3 * this.retryDelay));
        }
        return await new Promise(resolve => this.retryTimer = setTimeout(resolve, 5 * this.retryDelay));
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
            return this.promiseCompleter.reject(id, response.error);
        }
        return this.promiseCompleter.resolve(id, response.result);
    }

    private async closeTrack(producerId: ProducerId) {
        (await this.producers.get(producerId))?.close();
        this.producers.delete(producerId);

        (await this.consumers.get(producerId))?.close();
        this.consumers.delete(producerId);
    }

    private async onSourcePaused({ producerId, paused }: PauseEvent) {
        console.log(`Producer(${producerId}): Source pause (${producerId},${paused})`);
        const consumer = await this.consumers.get(producerId);
        if(consumer) {
            consumer.pausedAtSource = paused;
            paused ? await consumer.stop() : await consumer.start();
        }
    }

    private async onGloballyPaused({ producerId, paused }: PauseEvent) {
        console.log(`Producer(${producerId}): Global pause (${producerId},${paused})`);
        const producer = await this.producers.get(producerId);
        if(producer) { producer.pausedGlobally = paused; }

        const consumer = await this.consumers.get(producerId);
        if(consumer) { consumer.pausedGlobally = paused; }
    }

    // Decorators
    /// Decorator for ensuring that only one track is being created at a time.  Mostly to prevent a consumer being created as its local producer is being created.  Use via @SFU.createTrackLock().
    private static createTrackLock() {
        try {
            return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
                const childFunction = descriptor.value;
                descriptor.value = function (this: SFU, ...args: never[]) {
                    return this.createTrackLock.runExclusive(async () => {
                        console.log("Acquire CreateTrackLock");
                        return childFunction.apply(this, args);
                    });
                };
                return descriptor;
            };
        } finally {
            console.log("Release CreateTrackLock");
        }
    }

    /// Decorator for ensuring that the producer transport is not being changed or used to produce another track.  Use via @SFU.producerTransportLock().
    private static producerTransportLock() {
        try {
            return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
                const childFunction = descriptor.value;
                descriptor.value = function (this: SFU, ...args: never[]) {
                    return this.producerTransportLock.runExclusive(async () => {
                        console.log("Acquire ProducerTransportLock");
                        return childFunction.apply(this, args);
                    });
                };
                return descriptor;
            };
        } finally {
            console.log("Release ProducerTransportLock");
        }
    }

    /// Decorator for ensuring that the consumer transport is not being changed or used to consume another track.  Use via @SFU.consumerTransportLock().
    private static consumerTransportLock() {
        try {
            return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
                const childFunction = descriptor.value;
                descriptor.value = function (this: SFU, ...args: never[]) {
                    return this.consumerTransportLock.runExclusive(async () => {
                        console.log("Acquire ConsumerTransportLock");
                        return childFunction.apply(this, args);
                    });
                };
                return descriptor;
            };
        } finally {
            console.log("Release ConsumerTransportLock");
        }
    }
}
