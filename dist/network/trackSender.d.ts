import { SFU } from "./sfu";
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    private readonly name;
    start: (() => Promise<void>) & Readonly<{
        waitUntilUnlock: () => Promise<void>;
    }>;
    stop: (() => Promise<void>) & Readonly<{
        waitUntilUnlock: () => Promise<void>;
    }>;
    constructor(getSfu: () => SFU, getTrack: () => Promise<MediaStreamTrack>, name: string);
    private state?;
    private pause;
}
//# sourceMappingURL=trackSender.d.ts.map