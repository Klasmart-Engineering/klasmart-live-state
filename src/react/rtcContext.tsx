import { Store } from '@reduxjs/toolkit';
import React from 'react';
import { SFU } from '../network/sfu';
import { Action, State } from '../redux/reducer';

export class WebRtcManager<ApplicationState=unknown> {
    
    private sfus = new Map<string, SFU>();
    public constructor (
        public readonly store: Store<ApplicationState, Action>,
        public readonly selector: (s: ApplicationState) => State,
    ) {}

    private connectToSFU(url: string) {
        let sfu = this.sfus.get(url);
        if(!sfu) {
            sfu = new SFU(url)
            this.sfus.set(url, sfu);
        }
        return sfu
    }

    private getTrack() {}

    private createTracks(stream: MediaStream) {
        stream.getTracks().forEach(t => {})
    }

}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = 'KidsloopLiveWebRTC';

export default WebRtcContext;
