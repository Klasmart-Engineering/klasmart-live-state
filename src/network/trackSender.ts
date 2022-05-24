import { SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";
import {Producer} from "./track";
import {Mutex, withTimeout} from "async-mutex";
import {printIfDebugLocksEnabled} from "./utils";

export type TrackSenderState = "sending" | "not-sending" | "close" | "switching-sfu" | "creating" | "new";

export class TrackSender {
    private stateChangeLock = withTimeout(new Mutex(), 30000);
    private waitForTrackLock = withTimeout(new Mutex(), 300000);
    private _producer?: Producer;
    private emitter = new EventEmitter<{
        statechange: [TrackSenderState],
        waitForTrack: [],
    }>();
    private sfu?: SFU;
    private _maxFramerate?: number;
    private _maxWidth?: number;
    private _maxHeight?: number;
    private track?: MediaStreamTrack;
    private state: TrackSenderState;

    public constructor (
        private readonly name: string,
        private trackPromise: Promise<MediaStreamTrack>,
        private sfuPromise: Promise<SFU>,
        private readonly sessionId?: string,
    ) {
        this.state = "new";
        this.emitter.emit("statechange", "new");
    }

    public on: TrackSender["emitter"]["on"] = (event, callback) => this.emitter.on(event, callback);
    public off: TrackSender["emitter"]["off"] = (event, callback) => this.emitter.off(event, callback);
    public once: TrackSender["emitter"]["once"] = (event, callback) => this.emitter.once(event, callback);

    public get producer() { return this._producer; }

    public get sfuId() {
        return this.sfu?.id;
    }

    public get maxFramerate() { return this._maxFramerate; }
    public set maxFramerate(max: number|undefined) {
        if(!isOptionalNonZeroPositiveInteger(max)) { return; }
        this._maxFramerate = max;
    }

    public get maxWidth() { return this._maxWidth; }
    public set maxWidth(max: number|undefined) {
        if(!isOptionalNonZeroPositiveInteger(max)) { return; }
        this._maxWidth = max;
    }

    public get maxHeight() { return this._maxHeight; }
    public set maxHeight(max: number|undefined) {
        if(!isOptionalNonZeroPositiveInteger(max)) { return; }
        this._maxHeight = max;
    }

    @TrackSender.stateChangeLock()
    public async sending() {
        // Sending can only be initiated once we are in the "creating" or "not-sending" state.
        if (this.state === "new" || this.state === "close" || this.state === "switching-sfu" || !this.producer) return;

        await this.producer.start();
        this.state = "sending";
        this.emitter.emit("statechange", "sending");
    }

    @TrackSender.stateChangeLock()
    public async notSending() {
        // Not-sending can only be initiated once we are in the "sending" or "creating" state.
        if (this.state === "new" || this.state === "close" || this.state === "switching-sfu" || !this.producer) return;

        await this.producer.stop();
        this.state = "not-sending";
        this.emitter.emit("statechange", "not-sending");
    }

    @TrackSender.stateChangeLock()
    public async switchSfu(sfu: SFU) {
        this.producer?.close();
        this._producer = undefined;
        this.track = undefined;
        this.sfu = sfu;
        this.state = "switching-sfu";
        this.emitter.emit("statechange", "switching-sfu");
    }

    @TrackSender.stateChangeLock()
    public async replaceTrack(track: Promise<MediaStreamTrack>) {
        this.trackPromise = track;
    }

    @TrackSender.stateChangeLock()
    public async creating() {
        if (this.state === "sending" || this.state === "not-sending" || this.state === "creating") return;
        if (!this.sfu) {
            this.sfu = await this.sfuPromise;
        }
        this._producer = await this.sfu.produceTrack(
            await this.getParameter(),
            this.name,
            this.sessionId,
        );
        this._producer.once("close", async () => {
            await this.close();
        });
        this.state = "creating";
        this.emitter.emit("statechange", "creating");
    }

    @TrackSender.stateChangeLock()
    public async close() {
        this.producer?.close();
        this._producer = undefined;
        this.track = undefined;
        this.state = "close";
        this.emitter.emit("statechange", "close");
    }

    @TrackSender.waitForTrackLock()
    private async getParameter() {
        if (!this.track || this.track.readyState === "ended") {
            this.emitter.emit("waitForTrack");
            this.track = await this.trackPromise;
        }
        return {
            track: this.track,
            encodings: await this.getEncodings(),
        };
    }

    private async getEncodings(){
        if (!this.track) {
            return;
        }
        switch(this.track.kind) {
        case "video": {
            const { width, height } = this.track.getSettings();

            const scaleWidth = width && this._maxWidth ? width / this._maxWidth : undefined;
            const scaleHeight = height && this._maxHeight ? height / this._maxHeight : undefined;
            const scaleResolutionDownBy = scaleWidth && scaleHeight ? Math.max(scaleWidth, scaleHeight) : (scaleWidth || scaleHeight);

            const maxFramerate = this._maxFramerate;
            return [
                { scaleResolutionDownBy, maxFramerate },
            ];
        }
        }

        return;
    }

    // Decorators
    /// Decorator for ensuring the state is only being changed by one method at a time.  Use via @TrackSender.stateChangeLock().
    private static stateChangeLock() {
        return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const childFunction = descriptor.value;
            descriptor.value = function (this: TrackSender, ...args: never[]) {
                try {
                    return this.stateChangeLock.runExclusive(async () => {
                        printIfDebugLocksEnabled("Acquire StateChangeLock");
                        return childFunction.apply(this, args);
                    });
                } finally {
                    printIfDebugLocksEnabled("Release StateChangeLock");
                }
            };
            return descriptor;
        };
    }

    /// Decorator for ensuring that the "waitForTrack" event is only emitted once.  Use via @TrackSender.waitForTrackLock().
    private static waitForTrackLock() {
        return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const childFunction = descriptor.value;
            descriptor.value = function (this: TrackSender, ...args: never[]) {
                try {
                    return this.waitForTrackLock.runExclusive(async () => {
                        printIfDebugLocksEnabled("Acquire WaitForTrackLock");
                        return childFunction.apply(this, args);
                    });
                } finally {
                    printIfDebugLocksEnabled("Release WaitForTrackLock");
                }
            };
            return descriptor;
        };
    }
}

function isOptionalNonZeroPositiveInteger(x: unknown): x is number|undefined {
    switch(typeof x) {
    case "number":
        return Number.isSafeInteger(x) && x > 0;
    case "undefined":
        return true;
    default:
        return false;
    }
}
