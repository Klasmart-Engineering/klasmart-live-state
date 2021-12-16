import { Store } from "@reduxjs/toolkit";
import React from "react";
import { ProducerID, SFU, SfuID } from "../network/sfu";
import { Action, State } from "../redux/reducer";

export class WebRtcManager<ApplicationState = unknown> {

    private sfus = new Map<SfuID, SFU<ApplicationState>>();
    public constructor(
        public readonly store: Store<ApplicationState, Action>,
        public readonly selector: (s: ApplicationState) => State,
        public readonly getUrl: (id: SfuID) => URL,
    ) { }

    public async globalPause(sfuId: SfuID, producerId: ProducerID, paused: boolean) { throw new Error("Not implemented"); }
    public async localPause(sfuId: SfuID, producerId: ProducerID, paused: boolean) {
        const sfu = this.sfu(sfuId);
        return sfu.locallyPauseTrack(producerId, paused);
    }

    public getTracks(id: SfuID, ids: ProducerID[]) {
        const sfu = this.sfu(id);
        return ids.map(id => sfu.getTrack(id));
    }

    public sendTracks(id: SfuID, tracks: MediaStreamTrack[]) {
        const sfu = this.sfu(id);
        return tracks.map(t => sfu.produceTrack(t));
    }

    private sfu(id: SfuID) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            const url = this.getUrl(id).toString();
            sfu = new SFU<ApplicationState>(id, this.store, this.selector, url);
            this.sfus.set(id, sfu);
        }
        return sfu;
    }
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = "KidsloopLiveWebRTC";
