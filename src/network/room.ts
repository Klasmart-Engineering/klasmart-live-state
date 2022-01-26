import { ProducerId, SfuId } from "./sfu";
import { TransportState, WSTransport } from "./websocketTransport";
import EventEmitter from "eventemitter3";

export type TrackLocation = { sfuId: SfuId, producerId: ProducerId }

export type TrackInfo = TrackLocation & {
    name?: string,
    sessionId?: string,
};

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

    public tracks() { return [...(this._trackMap ?? []).values()]; }

    public getSessionTracks(sessionId: string): TrackInfo[] {
        this.ws.connect();
        const producerIds = this.sessionMap.get(sessionId);
        if(!producerIds) { return []; }
        return [...producerIds.values()].flatMap(id => this._trackMap?.get(id) || []);
    }

    public async getSfuId() {
        if(this._sfuId) {return this._sfuId;}
        this.ws.connect();
        return await new Promise<SfuId>(resolve => this.once("sfuId", id => resolve(id)));
    }

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
            null,
        );
    }

    private readonly ws: WSTransport;
    private readonly emitter = new EventEmitter<RoomEventMap>();
    private sessionMap = new Map<string, Set<ProducerId>>();
    private _trackMap?: Map<ProducerId,TrackInfo>;
    private _sfuId?: SfuId;

    private onTransportStateChange(state: TransportState) {
        switch(state) {
        case "not-connected":
            this.emitter.emit("disconnected");
            break;
        }
    }
    private onTransportMessage(data: string | ArrayBuffer | Blob) {
        console.log(data);
        if (typeof data !== "string") { return; }
        if(data.length === 0) { return; }
        const events = JSON.parse(data) as TrackInfoEvent[];
        if (typeof events !== "object" || !(events instanceof Array)) { return; }
        for(const event of events) { this.handleMessage(event); }
    }

    private handleMessage(e: TrackInfoEvent) {
        if("add" in e) { this.addTrackInfo(e.add); }
        if("remove" in e) { this.removeTrackInfo(e.remove); }
        if("sfuId" in e) { this.setSfuId(e.sfuId); }
    }

    private addTrackInfo(trackInfo: TrackInfo) {
        if(trackInfo.sessionId) { this.addProduceIdToSession(trackInfo.sessionId, trackInfo.producerId); }
        if(!this._trackMap) {this._trackMap = new Map<ProducerId,TrackInfo>(); }
        this._trackMap.set(trackInfo.producerId, trackInfo);
        this.emitter.emit("tracksUpdated", this._trackMap);
    }

    private removeTrackInfo(id: ProducerId) {
        if(!this._trackMap) { return; }
        this.removeProducerIdFromSession(id);
        this._trackMap.delete(id);
        this.emitter.emit("tracksUpdated", this._trackMap);
    }

    private addProduceIdToSession(sessionId: string, producerId: ProducerId) {
        let sessionTracks = this.sessionMap.get(sessionId);
        if(!sessionTracks) {
            sessionTracks = new Set<ProducerId>();
            this.sessionMap.set(sessionId, sessionTracks);
        }
        sessionTracks.add(producerId);
    }

    private removeProducerIdFromSession(id: ProducerId) {
        if(!this._trackMap) { return; }
        const trackInfo = this._trackMap.get(id);
        if(!trackInfo || !trackInfo.sessionId) { return; }
        this.sessionMap.get(trackInfo.sessionId)?.delete(id);
    }

    private setSfuId(id: SfuId) {
        this._sfuId = id;
        this.emitter.emit("sfuId", id);
    }
}

export type RoomEventMap = {
    tracksUpdated: (tracks: Map<ProducerId,TrackInfo>) => void;
    disconnected: () => void;
    sfuId: (sfuId: SfuId) => void; 
}