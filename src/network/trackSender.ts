import { Producer, SFU } from "./sfu";
import {EventEmitter} from "eventemitter3";

export class TrackSender {
    public on: TrackSender["emitter"]["on"] = (event, callback) => this.emitter.on(event, callback);
    public off: TrackSender["emitter"]["off"] = (event, callback) => this.emitter.off(event, callback);
    public once: TrackSender["emitter"]["once"] = (event, callback) => this.emitter.once(event, callback);

    public get producer() { return this._producer; }
    public async start() {
        //TODO: Check for race conditions
        if(this._producer) { return await this._producer.start(); }
        if(!this.sfu) { this.sfu = await this.getSfu(); }
        this._producer = await this.sfu.produceTrack(
            this.getTrack,
            this.name,
            this.sessionId,
        );
        this.emitter.emit("producer");
    }

    public async close() {
        if(this._producer) {
            await this._producer.close();
            this._producer = undefined;
        }
        if(this.sfu) {
            this.sfu = undefined;
        }
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

    private _producer?: Producer;
    private sfu?: SFU;
    private emitter = new EventEmitter<{
        producer: []
    }>();
}

