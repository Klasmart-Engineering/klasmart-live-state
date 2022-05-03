import EventEmitter from "eventemitter3";
import {types as MediaSoup} from "mediasoup-client";
import {newProducerID, ProducerId, ProducerParameters, Result} from "./sfu";

export abstract class Track {
    protected _pausedGlobally?: boolean;
    protected readonly emitter = new EventEmitter<TrackEventMap>();
    protected constructor(
        public readonly requestBroadcastStateChange: (paused: boolean) => Promise<void|Result>,
        protected readonly transport: MediaSoup.Transport
    ) { }

    public abstract get id(): ProducerId;
    public abstract get kind(): "audio" | "video" | undefined;
    public abstract get track(): MediaStreamTrack | null | undefined;

    public abstract start(): Promise<void>;
    public abstract stop(): Promise<void>;
    public abstract close(): void;

    public abstract get isMine(): boolean
    public abstract get pausedLocally(): boolean
    public abstract get pausedAtSource(): boolean | undefined

    public get pausedGlobally() { return this._pausedGlobally; }
    public set pausedGlobally(pause: boolean | undefined) {
        console.log("consumer set pausedGlobally", pause);
        if(this._pausedGlobally === pause) { return; }
        this._pausedGlobally = pause;
        this.emitter.emit("pausedGlobally", pause);
    }

    public readonly on: EventEmitter<TrackEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly once: EventEmitter<TrackEventMap>["once"] = (event, listener) => this.emitter.once(event, listener);
    public readonly off: EventEmitter<TrackEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);
}

export class Producer extends Track {
    public constructor(
        private readonly producer: MediaSoup.Producer,
        private readonly getParameters: () => Promise<ProducerParameters>,
        private notifyPause: (paused: boolean) => Promise<void|Result>,
        requestPauseGlobally: (paused: boolean) => Promise<void|Result>,
        transport: MediaSoup.Transport
    ) {
        super(requestPauseGlobally, transport);
        console.log("producer constructor", producer);
        producer.on("transportclose", () => this.stop());
        producer.on("trackended", () => this.stop());
        transport.on("connectionstatechange", async (state) => {
            console.log(`Producer connectionstatechange: ${state}`);
            if (state === "disconnected" || state === "failed" || state === "closed") {
                await this.stop();
                await this.close();
            }
        });
        transport.observer.on("close", async () => {
            console.log("Producer transport close");
            await this.stop();
            await this.close();
        });
    }

    public get id() { return newProducerID(this.producer.id); }
    public get kind() { return this.producer.kind as "audio"|"video"; }
    public get track() { return this.producer.track; }
    public override get isMine() { return true; }
    public override get pausedLocally() { return this.producer.paused; }
    public override get pausedAtSource() { return this.producer.paused; }

    public async start() {
        if(this.track?.readyState !== "live") {
            const { track, encodings } = await this.getParameters();
            const encoding = encodings[0];
            if(encoding) { await this.producer.setRtpEncodingParameters(encoding); }
            await this.producer.replaceTrack({track});
        }
        await this.pause(false);
    }

    public async stop() {
        await this.pause(true);
    }

    public close() {
        this.producer.close();
        this.emitter.emit("close");
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
    static readonly PAUSE_DELAY = 500;
    protected _pausedAtSource?: boolean;
    private pauseTimer?: NodeJS.Timeout;
    private pendingPauseStatus?: boolean;
    private lastPauseChange?: number;

    public constructor (
        private consumer: MediaSoup.Consumer,
        private notifyPause: (paused: boolean) => Promise<void|Result>,
        requestPauseGlobally: (paused: boolean) => Promise<void|Result>,
        transport: MediaSoup.Transport
    ) {
        super(requestPauseGlobally, transport);
        consumer.on("transportclose", () => this.pause(true));
        consumer.on("trackended", () => this.pause(true));
        transport.on("connectionstatechange", async (state) => {
            console.log(`Consumer connectionstatechange: ${state}`);
            if (state === "disconnected" || state === "failed" || state === "closed") {
                await this.stop();
                await this.close();
            }
        });
        transport.observer.on("close", async () => {
            console.log("Consumer transport close");
            await this.stop();
            await this.close();
        });
    }

    public get id() {
        if(!this.consumer) {throw new Error("Consumer has not yet initialized."); }
        return newProducerID(this.consumer.producerId);
    }
    public get kind() { return this.consumer.kind as "audio"|"video"|undefined; }
    public get track() { return this.consumer.track; }
    public override get isMine() { return false; }
    public override get pausedLocally() { return this.consumer.paused; }

    public get pausedAtSource() { return this._pausedAtSource; }
    public set pausedAtSource(paused: boolean | undefined) {
        if(this._pausedAtSource === paused) { return; }
        this._pausedAtSource = paused;
        this.emitter.emit("pausedAtSource", paused);
    }

    public async start() {
        await this.pause(false);
    }
    public async stop() {
        await this.pause(true);
    }
    public close() {
        this.consumer.close();
        this.emitter.emit("close");
    }

    private async pause(paused: boolean) {
        if (this.pauseTimer && this.pendingPauseStatus !== undefined && paused !== this.pendingPauseStatus) {
            clearTimeout(this.pauseTimer);
            this.pauseTimer = undefined;
            this.pendingPauseStatus = undefined;
        } else if (this.pauseTimer && this.pendingPauseStatus !== undefined && paused === this.pendingPauseStatus) {
            return;
        }
        if(this.pausedLocally === paused) { return; }

        // Don't introduce a delay if we haven't changed pause state recently
        const diff = Date.now() - (this.lastPauseChange ?? 0);
        this.lastPauseChange = Date.now();
        console.log(`Consumer.pause: diff=${diff}`);

        if (diff > Consumer.PAUSE_DELAY) {
            await Promise.allSettled([
                this.notifyPause(paused),
                paused
                    ? this.consumer.pause()
                    : this.consumer.resume()
            ]);
            this.emitter.emit("pausedLocally", this.pausedLocally);
            return;
        }

        // If the last pause change was recent, introduce a delay in case the pause state changes again
        this.pendingPauseStatus = paused;
        this.pauseTimer = setTimeout(async () => {
            await Promise.allSettled([
                this.notifyPause(paused),
                paused
                    ? this.consumer.pause()
                    : this.consumer.resume()
            ]);
            this.emitter.emit("pausedLocally", this.pausedLocally);
            this.pendingPauseStatus = undefined;
            this.pauseTimer = undefined;
        }, Consumer.PAUSE_DELAY);
    }
}

export type TrackEventMap = {
    close: () => void,
    pausedAtSource: (paused: boolean | undefined) => void,
    pausedGlobally: (paused: boolean | undefined) => void,
    pausedLocally: (paused: boolean | undefined) => void,
}
