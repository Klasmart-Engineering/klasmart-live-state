import { SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";
import {Producer} from "./track";
import {Mutex, withTimeout} from "async-mutex";
import {printIfDebugLocksEnabled} from "./utils";

export type TrackSenderState = "sending" | "not-sending" | "error" | "switching-sfu" | "creating";

export class TrackSender {
    private stateChangeLock = withTimeout(new Mutex(), 30000);
    private _producer?: Producer;
    private emitter = new EventEmitter<{
        statechange: [TrackSenderState]
    }>();
    private sfu?: SFU;
    private _maxFramerate?: number;
    private _maxWidth?: number;
    private _maxHeight?: number;

    public constructor (
        private readonly name: string,
        private track: Promise<MediaStreamTrack>,
        private sfuPromise: Promise<SFU>,
        private readonly sessionId?: string,
    ) {
        this.sfuPromise.then(sfu => {
            this.sfu = sfu;
            console.log(this.sfu.id);
        });
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

    public async sending() {
        if (!this.producer) {
            await this.creating();
        }
        await this.stateChangeLock.runExclusive(async () => {
            if(this._producer) {
                this.emitter.emit("statechange", "sending");
                return await this._producer.start();
            }
        });
    }

    @TrackSender.stateChangeLock()
    public async notSending() {
        this.emitter.emit("statechange", "not-sending");
        if(this._producer) { await this._producer.stop(); }
    }

    public async switchSfu(sfu: SFU) {
        await this.stateChangeLock.runExclusive(async () => {
            this.emitter.emit("statechange", "switching-sfu");
            if(!this._producer) { return; }
            this._producer.close();
            this._producer = undefined;
            this.sfu = sfu;
        });

        await this.sending();
    }

    @TrackSender.stateChangeLock()
    public async replaceTrack(track: Promise<MediaStreamTrack>) {
        this.track = track;
    }

    @TrackSender.stateChangeLock()
    private async creating() {
        this.emitter.emit("statechange", "creating");
        if (!this.sfu) {
            console.error("TrackSender: sfu is not set");
            throw new Error("SFU is not set");
        }
        console.log("trackSender: this.sfu.produceTrack");
        this._producer = await this.sfu.produceTrack(
            await this.getParameter(),
            this.name,
            this.sessionId,
        );
        this._producer.once("close", async () => {
            await this.error();
        });
        console.log("TrackSender created");
    }

    private async error() {
        await this.stateChangeLock.runExclusive(async () => {
            this.emitter.emit("statechange", "error");
            this._producer = undefined;
        });

        await this.creating();
    }

    private async getParameter() {
        return {
            track: await this.track,
            encodings: await this.getEncodings(),
        };
    }

    private async getEncodings(){
        const track = await this.track;
        switch(track.kind) {
        case "video": {
            const { width, height } = track.getSettings();

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
