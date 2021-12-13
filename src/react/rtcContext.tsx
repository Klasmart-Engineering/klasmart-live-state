import { Store } from '@reduxjs/toolkit';
import React from 'react';
import { ProducerID, SFU, SfuID } from '../network/sfu';
import { Action, State } from '../redux/reducer';

export class WebRtcManager<ApplicationState = unknown> {

    private sfus = new Map<SfuID, SFU<ApplicationState>>();
    public constructor(
        public readonly store: Store<ApplicationState, Action>,
        public readonly selector: (s: ApplicationState) => State,
    ) { }

    public async globalPause(sfuId: SfuID, producerId: ProducerID, paused: boolean) { throw new Error('Not implemented') }
    public async localPause(sfuId: SfuID, producerId: ProducerID, paused: boolean) { throw new Error('Not implemented') }

    public getTracks(id: SfuID, ids: ProducerID[]) {
        const sfu = this.sfu(id)
        return ids.map(id => sfu.getTrack(id))
    }

    public async recieveTrack(id: SfuID, ids: ProducerID[]) {
        const sfu = this.sfu(id)
        return await Promise.allSettled(ids.map(id => sfu.consumeTrack(id)))
    }

    public async sendTracks(id: SfuID, tracks: MediaStreamTrack[]) {
        const sfu = this.sfu(id)
        if(!sfu) { return }
        return await Promise.allSettled(tracks.map(t => sfu.produceTrack(t)))
    }

    private sfu(id: SfuID) {
        let sfu = this.sfus.get(id);
        if (!sfu) {
            sfu = new SFU<ApplicationState>(id, this.store, this.selector)
            this.sfus.set(id, sfu);
        }
        return sfu
    }
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = 'KidsloopLiveWebRTC';
