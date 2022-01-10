import { TrackLocation } from "../react/hooks/webrtc";
import { Producer, SFU } from "./sfu";
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    private readonly name;
    get location(): TrackLocation;
    get producer(): Producer | undefined;
    start(): Promise<void>;
    constructor(getSfu: () => SFU, getTrack: () => Promise<MediaStreamTrack>, name: string);
    private _producer?;
}
//# sourceMappingURL=trackSender.d.ts.map