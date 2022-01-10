import { Producer, SFU } from "./sfu";
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    private readonly name;
    get location(): {
        sfuId: import("./sfu").SfuId;
        producerId: import("./sfu").ProducerId;
    } | undefined;
    get producer(): Producer | undefined;
    start(): Promise<void>;
    constructor(getSfu: () => SFU, getTrack: () => Promise<MediaStreamTrack>, name: string);
    private _producer?;
}
//# sourceMappingURL=trackSender.d.ts.map