import { Producer, SFU } from "./sfu";
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    private readonly name;
    private readonly sessionId?;
    get location(): {
        sfuId: import("./sfu").SfuId;
        producerId: import("./sfu").ProducerId;
    } | undefined;
    get producer(): Producer | undefined;
    start(): Promise<void>;
    constructor(getSfu: () => Promise<SFU>, getTrack: () => Promise<MediaStreamTrack>, name: string, sessionId?: string | undefined);
    private _producer?;
    private _sfu?;
}
//# sourceMappingURL=trackSender.d.ts.map