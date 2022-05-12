import { SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";
import {Producer} from "./track";
import {Mutex} from "async-mutex";

export type TrackSenderState = "sending" | "not-sending" | "error" | "switching-sfu" | "creating";

export class TrackSender {
    private stateChangeLock = new Mutex();
    private _producer?: Producer;
    private emitter = new EventEmitter<{
        statechange: [TrackSenderState]
    }>();

    public constructor (
        private readonly name: string,
        private track: Promise<MediaStreamTrack>,
        private readonly sessionId?: string,
        private sfu?: SFU,
    ) {}

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

    private _maxFramerate?: number;
    private _maxWidth?: number;
    private _maxHeight?: number;

    public async sending() {
        await this.stateChangeLock.runExclusive(async () => {
            console.log(`TrackSender(${this.name}) stateSending`);
            if(this._producer) {
                this.emitter.emit("statechange", "sending");
                return await this._producer.start();
            }
        });

        await this.creating();
    }

    public async notSending() {
        return await this.stateChangeLock.runExclusive(async () => {
            this.emitter.emit("statechange", "not-sending");
            if(this._producer) { await this._producer.stop(); }
        });
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

    public async replaceTrack(track: Promise<MediaStreamTrack>) {
        await this.stateChangeLock.runExclusive(async () => {
            this.track = track;
        });
    }

    private async creating() {
        return await this.stateChangeLock.runExclusive(async () => {
            this.emitter.emit("statechange", "creating");
            if (!this.sfu) throw new Error("SFU is not set");
            this._producer = await this.sfu.produceTrack(
                await this.getParameter(),
                this.name,
                this.sessionId,
            );
            this._producer.once("close", async () => {
                await this.error();
            });
        });
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
}

const isOptionalNonZeroPositiveInteger = (x: unknown): x is number|undefined => {
    switch(typeof x) {
    case "number":
        return Number.isSafeInteger(x) && x > 0;
    case "undefined":
        return true;
    default:
        return false;
    }
};
