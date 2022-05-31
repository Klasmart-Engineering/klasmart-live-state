import EventEmitter from "eventemitter3";
import {types as MediaSoup} from "mediasoup-client";
import {newProducerID, ProducerId, ProducerParameters, TrackState} from "./sfuTypes";
import {Mutex} from "async-mutex";

export abstract class Track {
    protected pauseLock = new Mutex();
    protected _pausedGlobally?: boolean;
    protected readonly emitter = new EventEmitter<TrackEventMap>();
    protected constructor(
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

    public get state(): TrackState {
        return {
            producerId: this.id,
            kind: this.kind,
            isMine: this.isMine,
            isPausedLocally: this.pausedLocally,
            isPausedAtSource: Boolean(this.pausedAtSource),
            isPausedGlobally: Boolean(this.pausedGlobally),
        };
    }

    public readonly on: EventEmitter<TrackEventMap>["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly once: EventEmitter<TrackEventMap>["once"] = (event, listener) => this.emitter.once(event, listener);
    public readonly off: EventEmitter<TrackEventMap>["off"] = (event, listener) => this.emitter.off(event, listener);
}

export class Producer extends Track {
    public constructor(
        private readonly producer: MediaSoup.Producer,
        private parameters: ProducerParameters,
        transport: MediaSoup.Transport
    ) {
        super(transport);
        console.log("producer constructor", producer);
        producer.on("transportclose", async () => {
            await this.stop();
            this.close();
        });
        producer.on("trackended", () => this.stop());
        transport.on("connectionstatechange", async (state) => {
            console.log(`Producer connectionstatechange: ${state}`);
            if (state === "disconnected" || state === "failed" || state === "closed") {
                await this.stop();
                this.close();
            }
        });
        transport.observer.on("close", async () => {
            console.log("Producer transport close");
            await this.stop();
            this.close();
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
            const { track, encodings } = this.parameters;
            if (encodings) {
                const encoding = encodings[0];
                if(encoding) { await this.producer.setRtpEncodingParameters(encoding); }
            }
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
        return await this.pauseLock.runExclusive(async () => {
            paused
                ? this.producer.pause()
                : this.producer.resume();
            this.emitter.emit("pausedLocally", this.pausedLocally);
        });
    }
}

export class Consumer extends Track {
    static readonly UNPAUSE_DELAY = 500;
    protected _pausedAtSource?: boolean;
    private pauseTimer?: NodeJS.Timeout;
    private pendingPauseStatus?: boolean;
    private lastPauseChange?: number;

    public constructor (
        private consumer: MediaSoup.Consumer,
        transport: MediaSoup.Transport
    ) {
        super(transport);
        consumer.on("transportclose", () => this.pause(true));
        consumer.on("trackended", () => this.pause(true));
        transport.on("connectionstatechange", async (state) => {
            console.log(`Consumer connectionstatechange: ${state}`);
            if (state === "disconnected" || state === "failed" || state === "closed") {
                await this.stop();
                this.close();
            }
        });
        transport.observer.on("close", async () => {
            console.log("Consumer transport close");
            await this.stop();
            this.close();
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
        return await this.pauseLock.runExclusive(async () => {
            const hasTimer = this.pauseTimer !== undefined && this.pendingPauseStatus !== undefined;
            const pausedIsPending = this.pendingPauseStatus === paused;
            const shouldWaitForTimer = hasTimer && pausedIsPending;
            if (shouldWaitForTimer) {
                return;
            }

            const shouldClearTimer = hasTimer && !pausedIsPending;
            if (shouldClearTimer) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                clearTimeout(this.pauseTimer!);
                this.pauseTimer = undefined;
                this.pendingPauseStatus = undefined;
            }

            if(this.pausedLocally === paused) { return; }

            const diff = Date.now() - (this.lastPauseChange ?? 0);

            this.lastPauseChange = Date.now();

            // Don't introduce a delay if we haven't changed pause state recently
            if (diff > Consumer.UNPAUSE_DELAY || paused) {
                this.pauseConsumer(paused);
                return;
            }

            // If the last pause change was recent, introduce a delay in case the pause state changes again
            this.pendingPauseStatus = paused;
            this.pauseTimer = setTimeout(async () => {
                this.pauseConsumer(paused);
                this.pendingPauseStatus = undefined;
                this.pauseTimer = undefined;
            }, Consumer.UNPAUSE_DELAY);
        });
    }

    private pauseConsumer(paused: boolean) {
        paused
            ? this.consumer.pause()
            : this.consumer.resume();
        this.emitter.emit("pausedLocally", paused);
    }
}

export type TrackEventMap = {
    close: () => void,
    pausedAtSource: (paused: boolean | undefined) => void,
    pausedGlobally: (paused: boolean | undefined) => void,
    pausedLocally: (paused: boolean | undefined) => void,
}
