import { ProducerParameters, SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";
import {Producer} from "./track";
import { RtpEncodingParameters } from "mediasoup-client/lib/RtpParameters";
import {Mutex} from "async-mutex";

export type TrackSenderState = "sending" | "not-sending" | "error" | "switching-sfu" | "creating";

export class TrackSender {
    private stateChangeLock = new Mutex();
    private state: TrackSenderState = "not-sending";
    private _producer?: Producer;
    private sfu?: SFU;
    private emitter = new EventEmitter<{
        statechange: [TrackSenderState]
    }>();

    public constructor (
        private readonly getSfu: () => Promise<SFU>,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
        private readonly sessionId?: string,
    ) {
        this.on("statechange", async (state: TrackSenderState) => {
            if (this.state === state) {
                return;
            }
            await this.changeState(state);
        });
    }

    public on: TrackSender["emitter"]["on"] = (event, callback) => this.emitter.on(event, callback);
    public off: TrackSender["emitter"]["off"] = (event, callback) => this.emitter.off(event, callback);
    public once: TrackSender["emitter"]["once"] = (event, callback) => this.emitter.once(event, callback);

    public get producer() { return this._producer; }

    public async changeState(state: TrackSenderState) {
        return await this.stateChangeLock.runExclusive(async () =>{
            console.log(`changeState: ${state}`);
            this.state = state;
            switch(state) {
            case "sending":
                return await this.sending();
            case "not-sending":
                return await this.notSending();
            case "switching-sfu":
                return await this.switchSfu();
            case "error":
                return await this.error();
            case "creating":
                return await this.creating();
            default:
                console.error(`Unhandled TrackSenderState(${state})`);
            }
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

    private async sending() {
        console.log(`TrackSender(${this.name}) stateSending`);
        if(this._producer) {
            this.emitter.emit("statechange", "sending");
            return await this._producer.start();
        }
        this.emitter.emit("statechange", "creating");
    }

    private async notSending() {
        if(this._producer) { await this._producer.stop(); }
        this.emitter.emit("statechange", "not-sending");
    }

    private async switchSfu() {
        if(!this._producer) { return; }

        await this._producer.close();
        this._producer = undefined;
        if(this.sfu) { this.sfu = undefined; }
        this.emitter.emit("statechange", "sending");
    }

    private async creating() {
        if(!this.sfu) { this.sfu = await this.getSfu(); }
        this._producer = await this.sfu.produceTrack(
            this.getTrack,
            this.name,
            this.sessionId,
        );
        this._producer.once("close", async () => {
            this.emitter.emit("statechange", "error");
        });
    }

    private async error() {
        this._producer = undefined;
        this.emitter.emit("statechange", "creating");
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