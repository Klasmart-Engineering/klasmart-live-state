import { MergingMutex } from "../mergingMutex";
import { ProducerState, SFU } from "./sfu";

export class TrackSender {
    public start = MergingMutex(async () => {
        await this.stop.waitUntilUnlock();
        if(!this.state) {
            const sfu = this.getSfu();
            const media = await this.getTrack();
            this.state = await sfu.createProducer(media, this.name);
        } else {
            const media = this.state.producer.track;
            if(!media || media.readyState === "ended") {
                const track = await this.getTrack();
                await this.state.producer.replaceTrack({track}).catch(e => console.error("failed to replace", e));
            }
            await this.pause(false);
        }
    });

    public stop = MergingMutex(async () => {
        if(!this.state) { return; }
        const { producer } = this.state;
        await producer.replaceTrack({track: null});
        await this.pause(true);
    });

    public constructor (
        private readonly getSfu: () => SFU,
        private readonly getTrack: () => Promise<MediaStreamTrack>,
        private readonly name: string,
    ) {}

    private state?: ProducerState;

    //TODO: Move into producerState
    private async pause(paused: boolean) {
        if(!this.state) { return; }
        if(this.state.producer.paused === paused) { return; }
        if(paused) {
            this.state.producer.pause();
        } else {
            this.state.producer.resume();
        }
        await this.state.sfu.setPauseState(this.state.id, paused);
    }
}

