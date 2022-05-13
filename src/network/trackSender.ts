import { ProducerParameters, SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";
import {Producer} from "./track";
import { RtpEncodingParameters } from "mediasoup-client/lib/RtpParameters";

export type TrackSenderState = "sending" | "not-sending"

export class TrackSender {
    public constructor (
        private readonly getSfu: () => Promise<SFU>,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
        private readonly sessionId?: string,
    ) {}

    public on: TrackSender["emitter"]["on"] = (event, callback) => this.emitter.on(event, callback);
    public off: TrackSender["emitter"]["off"] = (event, callback) => this.emitter.off(event, callback);
    public once: TrackSender["emitter"]["once"] = (event, callback) => this.emitter.once(event, callback);

    public get producer() { return this._producer; }

    public async changeState(state: "sending" | "not-sending" | "switching-sfu") {
        while(this.stateChange) { await this.stateChange.catch(() => true); }
        return this.stateChange = new Promise<unknown>(resolve => {
            let promise: Promise<unknown> | undefined;
            switch(state) {
            case "sending":
                promise = this.stateSending();
                break;
            case "not-sending":
                promise = this.stateNotSending();
                break;
            case "switching-sfu":
                promise = this.stateSwitchSfu();
                break;
            default:
                console.error(`Unhandled TrackSenderState(${state})`);
                promise = Promise.resolve();
            }
            resolve(promise);
            promise.finally(() => this.stateChange = undefined);
        });
    }


    public get sfuId() {
        return this.sfu?.id;
    }

    public getMaxFramerate() { return this._maxFramerate; }
    public setMaxFramerate(max?:  number) {
        if(!isOptionalNonZeroPositiveInteger(max)) { return; }
        this._maxFramerate = max;
    }

    public getMaxWidth() { return this._maxWidth; }
    public setMaxWidth(max?:  number) {
        if(!isOptionalNonZeroPositiveInteger(max)) { return; }
        this._maxWidth = max;
    }

    public getMaxHeight() { return this._maxHeight; }
    public setMaxHeight(max?:  number) {
        if(!isOptionalNonZeroPositiveInteger(max)) { return; }
        this._maxHeight = max;
    }

    private _maxFramerate?: number;
    private _maxWidth?: number;
    private _maxHeight?: number;

    private async stateSending() {
        try {
            if(this._producer) { return await this._producer.start(); }
            if(!this.sfu) { this.sfu = await this.getSfu(); }
            this._producer = await this.sfu.produceTrack(
                () => this.getParameter(),
                this.name,
                this.sessionId,
            );
        } finally {
            this.emitter.emit("statechange", "sending");
        }
    }

    private async stateNotSending() {
        if(this._producer) { await this._producer.stop(); }
        this.emitter.emit("statechange", "not-sending");
    }

    private async stateSwitchSfu() {
        if(!this._producer) { return; }

        await this._producer.close();
        this._producer = undefined;
        if(this.sfu) { this.sfu = undefined; }
        this.emitter.emit("statechange", "not-sending");

        await this.stateSending();

    }

    private async getParameter(): Promise<ProducerParameters> {
        const track = await this.getTrack();

        return {
            track,
            encodings: this.getEncodings(track),
        };
    }

    private getEncodings(track: MediaStreamTrack): RtpEncodingParameters[]|undefined {
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

        return undefined;
    }

    private stateChange?: Promise<unknown>;

    private _producer?: Producer;
    private sfu?: SFU;
    private emitter = new EventEmitter<{
        statechange: [TrackSenderState]
    }>();
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