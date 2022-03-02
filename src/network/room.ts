import { ProducerId, SfuId } from "./sfu";
import { TransportState, WSTransport } from "./websocketTransport";
import EventEmitter from "eventemitter3";

export type TrackLocation = { sfuId: SfuId, producerId: ProducerId }
const trackLocationEquals = (a: TrackLocation, b: TrackLocation) =>
    (a.producerId === b.producerId)
    && (a.sfuId === b.sfuId);

export type TrackInfo = TrackLocation & {
    name?: string,
    sessionId?: string,
};
const trackInfoEquals = (a: TrackInfo, b: TrackInfo) =>
    trackLocationEquals(a,b)
    && (a.name === b.name)
    && (a.sessionId === b.sessionId);

export type TrackInfoEvent = {
    add: TrackInfo
} | {
    remove: ProducerId
} | {
    sfuId: SfuId
}

export class Room {
    public readonly on: Room["emitter"]["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly off: Room["emitter"]["off"] = (event, listener) => this.emitter.off(event, listener);
    public readonly once: Room["emitter"]["once"] = (event, listener) => this.emitter.once(event, listener);
    // The sfu on which the client will attempt to place their tracks.
    private _producerSfuId?: SfuId;
    private readonly ws: WSTransport;
    private readonly emitter = new EventEmitter<RoomEventMap>();
    private sessionMap = new Map<string, Set<ProducerId>>();
    private trackInfoByProducerId = new Map<ProducerId,TrackInfo>();

    public constructor(
        public readonly endpoint: string,
    ) {
        this.ws = new WSTransport(
            endpoint,
            (_, d) => this.onTransportMessage(d),
            t => this.onTransportStateChange(t),
            undefined,
            true,
            null,
            5000,
        );
    }

    public tracks() { return [...this.trackInfoByProducerId.values()]; }

    public getSessionTracks(sessionId: string): TrackInfo[] {
        this.ws.connect().catch((e) =>  console.error(e));
        const producerIds = this.sessionMap.get(sessionId);
        if(!producerIds) { return []; }
        return [...producerIds.values()].flatMap(id => this.trackInfoByProducerId.get(id) ?? []);
    }

    public async getSfuIds() {
        const sfuIds = new Set<SfuId>();
        this.tracks().map(t => sfuIds.add(t.sfuId));
        return [...sfuIds];
    }

    public async getProducerSfuId(excludeId?: SfuId) {
        if(this._producerSfuId && excludeId !== this._producerSfuId) { return this._producerSfuId; }
        this._producerSfuId = undefined;
        const response = new Promise<SfuId>(resolve => this.once("sfuId", id => resolve(id)));
        await this.ws.connect();
        await this.ws.send(JSON.stringify({ excludeId }));
        return await response;
    }

    private onTransportStateChange(state: TransportState) {
        switch(state) {
        case "not-connected":
            this.emitter.emit("disconnected");
            break;
        }
    }
    private onTransportMessage(data: string | ArrayBuffer | Blob) {
        if (typeof data !== "string") { return; }
        if(data.length === 0) { return; }
        const events = JSON.parse(data);
        if (typeof events !== "object" || !(events instanceof Array)) { return; }
        for(const event of <TrackInfoEvent[]>events) { this.handleMessage(event); }
    }

    private handleMessage(e: TrackInfoEvent) {
        if("add" in e) { this.addTrackInfo(e.add); }
        if("remove" in e) { this.removeTrackInfo(e.remove); }
        if("sfuId" in e) { this.setProducerSfuId(e.sfuId); }
    }

    private addTrackInfo(trackInfo: TrackInfo) {
        const currentTrackInfo = this.trackInfoByProducerId.get(trackInfo.producerId);
        if(currentTrackInfo && trackInfoEquals(currentTrackInfo, trackInfo)) { return; }

        if(trackInfo.sessionId) { this.addProducerIdToSession(trackInfo.sessionId, trackInfo.producerId); }
        this.trackInfoByProducerId.set(trackInfo.producerId, trackInfo);
        this.emitter.emit("tracksUpdated", this.trackInfoByProducerId);
    }

    private removeTrackInfo(id: ProducerId) {
        if(!this.trackInfoByProducerId.has(id)) { return; }
        this.removeProducerIdFromSession(id);
        this.trackInfoByProducerId.delete(id);
        this.emitter.emit("tracksUpdated", this.trackInfoByProducerId);
    }

    private addProducerIdToSession(sessionId: string, producerId: ProducerId) {
        let sessionTracks = this.sessionMap.get(sessionId);
        if(!sessionTracks) {
            sessionTracks = new Set<ProducerId>();
            this.sessionMap.set(sessionId, sessionTracks);
        }
        sessionTracks.add(producerId);
    }

    private removeProducerIdFromSession(id: ProducerId) {
        const trackInfo = this.trackInfoByProducerId.get(id);
        if(!trackInfo || !trackInfo.sessionId) { return; }
        this.sessionMap.get(trackInfo.sessionId)?.delete(id);
    }

    private setProducerSfuId(id: SfuId) {
        this._producerSfuId = id;
        this.emitter.emit("sfuId", id);
    }
}

export type RoomEventMap = {
    tracksUpdated: (tracks: Map<ProducerId,TrackInfo>) => void;
    disconnected: () => void;
    sfuId: (sfuId: SfuId) => void;
}
