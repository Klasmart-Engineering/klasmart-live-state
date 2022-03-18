import { Producer, SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";

export type TrackSenderState = "sending" | "not-sending"

export class TrackSender {
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

    public constructor (
        private readonly getSfu: () => Promise<SFU>,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
        private readonly sessionId?: string,
    ) {}

    private async stateSending() {
        try {
            if(this._producer) { return await this._producer.start(); }
            if(!this.sfu) { this.sfu = await this.getSfu(); }
            this._producer = await this.sfu.produceTrack(
                this.getTrack,
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

    private stateChange?: Promise<unknown>;

    private _producer?: Producer;
    private sfu?: SFU;
    private emitter = new EventEmitter<{
        statechange: [TrackSenderState]
    }>();
}

