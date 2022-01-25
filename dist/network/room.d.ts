import { ProducerId, SfuId } from "./sfu";
export declare type TrackInfo = {
    sfuId: SfuId;
    producerId: ProducerId;
    name?: string;
    sessionId?: string;
};
export declare type TrackInfoEvent = {
    add: TrackInfo;
} | {
    remove: ProducerId;
} | {
    sfuId: SfuId;
};
export declare class Room {
    readonly endpoint: string;
    readonly on: Room["emitter"]["on"];
    readonly off: Room["emitter"]["off"];
    readonly once: Room["emitter"]["once"];
    tracks(): Promise<IterableIterator<TrackInfo>>;
    sfuId(): Promise<SfuId>;
    constructor(endpoint: string);
    private readonly ws;
    private readonly emitter;
    private _trackMap?;
    private _sfuId?;
    private onTransportStateChange;
    private onTransportMessage;
    private handleMessage;
    private trackMap;
}
export declare type RoomEventMap = {
    changed: (tracks: Map<ProducerId, TrackInfo>) => void;
    disconnected: () => void;
    sfuId: (sfuId: SfuId) => void;
};
//# sourceMappingURL=room.d.ts.map