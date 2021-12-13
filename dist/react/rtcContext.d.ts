import { Store } from '@reduxjs/toolkit';
import React from 'react';
import { ProducerID, SfuID } from '../network/sfu';
import { Action, State } from '../redux/reducer';
export declare class WebRtcManager<ApplicationState = unknown> {
    readonly store: Store<ApplicationState, Action>;
    readonly selector: (s: ApplicationState) => State;
    private sfus;
    constructor(store: Store<ApplicationState, Action>, selector: (s: ApplicationState) => State);
    globalPause(sfuId: SfuID, producerId: ProducerID, paused: boolean): Promise<void>;
    localPause(sfuId: SfuID, producerId: ProducerID, paused: boolean): Promise<void>;
    getTracks(id: SfuID, ids: ProducerID[]): Promise<MediaStreamTrack>[];
    recieveTrack(id: SfuID, ids: ProducerID[]): Promise<PromiseSettledResult<import("mediasoup-client/lib/Consumer").Consumer>[]>;
    sendTracks(id: SfuID, tracks: MediaStreamTrack[]): Promise<PromiseSettledResult<import("mediasoup-client/lib/Producer").Producer>[] | undefined>;
    private sfu;
}
export declare const WebRtcContext: React.Context<WebRtcManager<unknown>>;
//# sourceMappingURL=rtcContext.d.ts.map