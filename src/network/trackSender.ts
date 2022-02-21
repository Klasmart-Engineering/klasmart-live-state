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
        if(!this._sfu) { this._sfu = await this.getSfu(); }
        this._producer = await this._sfu.produceTrack(
            this.getTrack,
            this.name,
            this.sessionId,
        );
        this.emitter.emit("producer");
    }

    public constructor (
        private readonly getSfu: () => Promise<SFU>,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
        private readonly sessionId?: string,
    ) {}

    private _producer?: Producer;
    private _sfu?: SFU;
    private emitter = new EventEmitter<{
        producer: []
    }>();
}

