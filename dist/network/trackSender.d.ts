import { Producer, SFU } from "./sfu";
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    private readonly name;
    private readonly sessionId?;
    on: TrackSender["emitter"]["on"];
    off: TrackSender["emitter"]["off"];
    once: TrackSender["emitter"]["once"];
    get producer(): Producer | undefined;
    start(): Promise<void>;
    constructor(getSfu: () => Promise<SFU>, getTrack: () => Promise<MediaStreamTrack>, name: string, sessionId?: string | undefined);
    private _producer?;
    private _sfu?;
    private emitter;
}
//# sourceMappingURL=trackSender.d.ts.map