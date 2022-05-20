import {types as MediaSoup} from "mediasoup";
import { nanoid } from "nanoid";
import { newProducerID } from "../../network/sfu";

export class MockTransport {
    private producer?: MockProducer;
    private consumer?: MockConsumer;
    public async produce(params: MediaSoup.ProducerOptions) {
        const { producer, trigger } = createMockProducer(params.id);
        this.producer = trigger;
        return producer;
    }

    public async consume(params: MediaSoup.ConsumerOptions) {
        const { consumer, trigger } = createMockConsumer(params.producerId);
        this.consumer = trigger;
        return consumer;
    }

    public triggerProducer(event: string) {
        return this.producer?.trigger(event);
    }

    public triggerConsumer(event: string) {
        return this.consumer?.trigger(event);
    }

    public setProducerPaused(paused: boolean) {
        if (!this.consumer) {
            return;
        }
        this.consumer.producerPaused = paused;
    }
}

export function createMockTransport() {
    const mockTransport = new MockTransport();
    return mockTransport as unknown as MediaSoup.WebRtcTransport;
}

class MockProducer {
    public paused = true;
    public closed = false;
    private eventHandlers = new Map<string, () => unknown>();
    private readonly _id?: string;

    public constructor(id?: string) {
        if (id) {
            this._id = id;
        }
        else {
            this._id = newProducerID(nanoid());
        }
    }

    public get id() {
        return this._id;
    }

    public async resume() {
        this.paused = false;
    }

    public async pause() {
        this.paused = true;
    }

    public close() {
        this.closed = true;
    }

    public on(event: string, callback: () => unknown) {
        this.eventHandlers.set(event, callback);
    }

    public trigger(event: string) {
        console.log(JSON.stringify(this));
        const handler = this.eventHandlers.get(event);
        if (!handler) {
            throw new Error(`No handler for event ${event}`);
        }
        return handler();
    }
}

export function createMockProducer(id?: string) {
    const mockProducer = new MockProducer(id);
    return {producer: mockProducer as unknown as MediaSoup.Producer,
        trigger: mockProducer};
}

export class MockConsumer {
    public producerPaused = true;
    public paused = true;
    public closed = false;
    private eventHandlers = new Map<string, () => unknown>();
    public kind = "audio";
    public rtpParameters = {codecs: mediaCodecs};
    public producerId: string;

    public constructor(private readonly _id: string) {
        this.producerId = _id;
    }

    public get id() {
        return this._id;
    }

    public async resume() {
        this.paused = false;
    }

    public async pause() {
        this.paused = true;
    }

    public close() {
        this.closed = true;
    }

    public on(event: string, callback: () => unknown) {
        this.eventHandlers.set(event, callback);
    }

    public trigger(event: string) {
        const handler = this.eventHandlers.get(event);
        if (!handler) {
            throw new Error(`No handler for event ${event}`);
        }
        return handler();
    }
}

function createMockConsumer(id: string) {
    const mockConsumer = new MockConsumer(id);
    return {consumer: mockConsumer as unknown as MediaSoup.Consumer,
        trigger: mockConsumer};
}

export async function setupMockConsumer(transport?: MediaSoup.WebRtcTransport) {
    if (!transport) transport = createMockTransport();
    const producerId = newProducerID(nanoid());
    const rtpCapabilities = {codecs: mediaCodecs};
    return Consumer.create(transport, producerId, rtpCapabilities);
}