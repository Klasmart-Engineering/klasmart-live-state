import { ProducerState, SFU } from "./sfu";

export class TrackSender {
    public async start() {
        if(this.state) {
            await this.state.start(this.getTrack);
        } else {
            const sfu = this.getSfu();
            const media = await this.getTrack();
            this._state = await sfu.createProducer(media, this.name);
        }
    }
    
    public async stop() { await this.state?.stop(); }

    public get state() { return this._state; }

    public constructor (
        private readonly getSfu: () => SFU,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
    ) {}

    private _state?: ProducerState;
}

