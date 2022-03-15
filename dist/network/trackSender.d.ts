import { Producer, SFU } from "./sfu";
export declare type TrackSenderState = "sending" | "not-sending";
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    private readonly name;
    private readonly sessionId?;
    on: TrackSender["emitter"]["on"];
    off: TrackSender["emitter"]["off"];
    once: TrackSender["emitter"]["once"];
    get producer(): Producer | undefined;
    changeState(state: "sending" | "not-sending" | "switching-sfu"): Promise<unknown>;
    get sfuId(): import("./sfu").SfuId | undefined;
    constructor(getSfu: () => Promise<SFU>, getTrack: () => Promise<MediaStreamTrack>, name: string, sessionId?: string | undefined);
    private stateSending;
    private stateNotSending;
    private stateSwitchSfu;
    private stateChange?;
    private _producer?;
    private sfu?;
    private emitter;
}
//# sourceMappingURL=trackSender.d.ts.map