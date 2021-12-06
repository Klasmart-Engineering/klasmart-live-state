import { Store } from '@reduxjs/toolkit';
import React from 'react';
import { Action, State } from '../redux/reducer';
import { TransportState, WSTransport } from '../websocketTransport';
import {types as MediaSoup, Device} from "mediasoup-client"

//TODO: share ID types
export type TrackId = string & {something: true}

export class SFU {
    private ws: WSTransport
    private device = new Device();
    private rtpCapabilities?: MediaSoup.RtpCapabilities
    private sendTransport?: MediaSoup.Transport
    private recieveTransport?: MediaSoup.Transport
    private consumers = new Map<TrackId, MediaSoup.Consumer>()
    private producers = new Map<TrackId, MediaSoup.Producer>()
    
    public constructor(
        url: string,
    ) {
        this.ws = new WSTransport(
            url,
            (_,d) => this.onMessage(d),
            t => this.onStateChange(t),
            ['live-sfu'],
            true
        )
        this.ws.connect()   
    }

    private onMessage(data: string | ArrayBuffer | Blob) {}

    private onStateChange(state: TransportState) {}

    private createTrack(track: MediaStreamTrack) {
        const kind = track.kind;
    }
    private consumerTrack(trackId: TrackId) {}

}

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
