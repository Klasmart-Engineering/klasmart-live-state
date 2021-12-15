import { types as MediaSoup } from "mediasoup-client";
import { NewType } from "../types";
import { Store } from "@reduxjs/toolkit";
import { Action, State } from "../redux/reducer";
export declare type SfuID = NewType<string, "sfuId">;
export declare type ProducerID = NewType<string, "producerId">;
export declare type ConsumerID = NewType<string, "consumerId">;
export declare type RequestID = NewType<string, "requestId">;
export declare type PauseMessage = {
    id: ProducerID;
    localPause: boolean;
    globalPause: boolean;
};
export declare type WebRtcTransportResult = {
    id: string;
    iceCandidates: MediaSoup.IceCandidate[];
    iceParameters: MediaSoup.IceParameters;
    dtlsParameters: MediaSoup.DtlsParameters;
    sctpParameters?: MediaSoup.SctpParameters;
};
export declare type Track = {
    producer?: MediaSoup.Producer;
    consumer?: MediaSoup.Consumer;
    localPause: boolean;
    globalPause: boolean;
};
export declare class SFU<ApplicationState = unknown> {
    private readonly id;
    private readonly store;
    private readonly selector;
    readonly url: string;
    private readonly device;
    private readonly tracks;
    private readonly promiseCompleter;
    private readonly ws;
    constructor(id: SfuID, store: Store<ApplicationState, Action>, selector: (s: ApplicationState) => State, url: string);
    getTrack(id: ProducerID): Promise<MediaStreamTrack>;
    produceTrack(track: MediaStreamTrack): Promise<MediaSoup.Producer>;
    private consumeTrack;
    private consumerTransport;
    private producerTransport;
    private sendRtpCapabilities;
    private loadDevice;
    private request;
    private _requestId;
    private generateRequestId;
    private onTransportStateChange;
    private onTransportMessage;
    private static parse;
    private handleMessage;
    private response;
    private closeTrack;
    private setTrack;
    private handlePauseMessage;
}
//# sourceMappingURL=sfu.d.ts.map