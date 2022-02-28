import { ProducerId, SfuId } from "./sfu";
export declare type TrackLocation = {
    sfuId: SfuId;
    producerId: ProducerId;
};
export declare type TrackInfo = TrackLocation & {
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
    tracks(): TrackInfo[];
    getSessionTracks(sessionId: string): TrackInfo[];
    getSfuId(useCache?: boolean): Promise<SfuId>;
    constructor(endpoint: string);
    private readonly ws;
    private readonly emitter;
    private sessionMap;
    private trackInfoByProducerId?;
    private _sfuIdCache?;
    private onTransportStateChange;
    private onTransportMessage;
    private handleMessage;
    private addTrackInfo;
    private removeTrackInfo;
    private addProducerIdToSession;
    private removeProducerIdFromSession;
    private setSfuId;
}
export declare type RoomEventMap = {
    tracksUpdated: (tracks: Map<ProducerId, TrackInfo>) => void;
    disconnected: () => void;
    sfuId: (sfuId: SfuId) => void;
};
//# sourceMappingURL=room.d.ts.map