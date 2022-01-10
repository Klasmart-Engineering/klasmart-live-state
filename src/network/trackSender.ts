import { TrackLocation } from "../react/hooks/webrtc";
import { Producer, SFU } from "./sfu";

export class TrackSender {

    //TODO: Remove
    public get location() {
        return {
            sfuId: this.getSfu().id,
            producerId: this._producer?.id,
        } as TrackLocation;
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

