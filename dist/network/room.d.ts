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
    private _producerSfuId?;
    private readonly ws;
    private readonly emitter;
    private sessionMap;
    private trackInfoByProducerId;
    constructor(endpoint: string);
    tracks(): TrackInfo[];
    getSessionTracks(sessionId: string): TrackInfo[];
    getSfuIds(): Promise<SfuId[]>;
    removeSfuId(id: SfuId): Promise<void>;
    getProducerSfuId(excludeId?: SfuId): Promise<SfuId>;
    close(): void;
    private onTransportStateChange;
    private onTransportMessage;
    private handleMessage;
    private addTrackInfo;
    private removeTrackInfo;
    private addProducerIdToSession;
    private removeProducerIdFromSession;
    private setProducerSfuId;
}
export declare type RoomEventMap = {
    close: () => void;
    tracksUpdated: (tracks: Map<ProducerId, TrackInfo>) => void;
    disconnected: () => void;
    sfuId: (sfuId: SfuId) => void;
};
//# sourceMappingURL=room.d.ts.map