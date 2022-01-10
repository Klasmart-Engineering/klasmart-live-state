import { Producer, SFU } from "./sfu";

export class TrackSender {

    //TODO: Remove
    public get location() {
        if(!this._producer) { return; }
        return {
            sfuId: this.getSfu().id,
            producerId: this._producer.id,
        };
    }
    
    public get producer() { return this._producer; }
    public async start() {
        if(this._producer) { return await this._producer.start();}
        this._producer = await this.getSfu().produceTrack(
            this.getTrack,
            this.name
        );
    }

    public constructor (
        private readonly getSfu: () => SFU,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
    ) {}

    private _producer?: Producer;
}

