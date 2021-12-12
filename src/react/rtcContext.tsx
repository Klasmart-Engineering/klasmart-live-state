import { Store } from '@reduxjs/toolkit';
import React from 'react';
import { useSelector } from 'react-redux';
import { ProducerId, SFU } from '../network/sfu';
import { Action, State } from '../redux/reducer';

export class WebRtcManager<ApplicationState=unknown> {
    
    private sfus = new Map<string, SFU<ApplicationState>>();
    public constructor (
        public readonly store: Store<ApplicationState, Action>,
        public readonly selector: (s: ApplicationState) => State,
    ) {}

    public track(url: string, trackId: string) {
        return this.sfu(url)?.track(trackId as ProducerId)
    }

    public send(url: string, track: MediaStreamTrack) {
        return this.sfu(url).createTrack(track)
    }

    private createTracks(url: string, stream: MediaStream) {
        const sfu = this.sfu(url)
        stream.getTracks().forEach(t => )
    }

    private sfu(url: string) {
        let sfu = this.sfus.get(url);
        if(!sfu) {
            sfu = new SFU<ApplicationState>(this.store, this.selector, url)
            this.sfus.set(url, sfu);
        }
        return sfu
    }
}

export const WebRtcContext = React.createContext<WebRtcManager>(null as any);
WebRtcContext.displayName = 'KidsloopLiveWebRTC';
