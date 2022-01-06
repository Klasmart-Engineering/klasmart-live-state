import { Producer, SFU } from "./sfu";

export class TrackSender {
    public async start() {
        if(this.track) {
            await this.track.start();
        } else {
            const sfu = this.getSfu();
            this.track = await sfu.produceTrack(this.getTrack, this.name);
        }
    }
    
    public async stop() { await this.track?.stop(); }


    public constructor (
        private readonly getSfu: () => SFU,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
    ) {}

    private track?: Producer;
}

