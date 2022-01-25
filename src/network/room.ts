import { ProducerId, SfuId } from "./sfu";
import { TransportState, WSTransport } from "./websocketTransport";
import EventEmitter from "eventemitter3";

export type TrackInfo = {
    sfuId: SfuId,
    producerId: ProducerId,
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

    public async tracks(): Promise<IterableIterator<TrackInfo>> {
        const trackMap = await this.trackMap();
        return trackMap.values();
    }

    public async sfuId() {
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
        if("add" in e) {
            if(!this._trackMap) {this._trackMap = new Map<ProducerId,TrackInfo>(); }
            this._trackMap.set(e.add.producerId, e.add);
            this.emitter.emit("changed", this._trackMap);
        }
        if("remove" in e) {
            if(this._trackMap?.delete(e.remove)) {
                this.emitter.emit("changed", this._trackMap);
            }
        }
        if("sfuId" in e) {
            this._sfuId = e.sfuId;
            this.emitter.emit("sfuId", e.sfuId);
        }
    }

    private async trackMap() {
        if(this._trackMap) { return this._trackMap; }
        this.ws.connect();
        return await new Promise<Map<ProducerId,TrackInfo>>(resolve => this.once("changed", trackMap => resolve(trackMap)));
    }
}

export type RoomEventMap = {
    changed: (tracks: Map<ProducerId,TrackInfo>) => void;
    disconnected: () => void;
    sfuId: (sfuId: SfuId) => void; 
}