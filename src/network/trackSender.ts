import { Producer, SFU } from "./sfu";

export class TrackSender {

    //TODO: Remove
    public get location() {
        if(!this._producer) { return; }
        if(!this._sfu) { return; }
        return {
            sfuId: this._sfu.id,
            producerId: this._producer.id,
        };
    }
    
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
    }

    public constructor (
        private readonly getSfu: () => Promise<SFU>,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
        private readonly sessionId?: string,
    ) {}

    private _producer?: Producer;
    private _sfu?: SFU;
}

