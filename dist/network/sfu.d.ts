import { types as MediaSoup } from "mediasoup-client";
import { NewType } from "../types";
import { Store } from "@reduxjs/toolkit";
import { Action } from "../redux/reducer";
export declare type SfuID = NewType<string, "sfuId">;
export declare const newSfuID: (id: string) => SfuID;
export declare type ProducerID = NewType<string, "producerId">;
export declare const newProducerID: (id: string) => ProducerID;
export declare type ConsumerID = NewType<string, "consumerId">;
export declare const newConsumerID: (id: string) => ConsumerID;
export declare type RequestID = NewType<string, "requestId">;
export declare const newRequestID: (id: string) => RequestID;
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
declare type Result = {
    routerRtpCapabilities?: MediaSoup.RtpCapabilities;
    producerTransport?: WebRtcTransportResult;
    createTrack?: ProducerID;
    consumerTransport?: WebRtcTransportResult;
    consumerCreated?: {
        id: ConsumerID;
        producerId: ProducerID;
        kind: MediaSoup.MediaKind;
        rtpParameters: MediaSoup.RtpParameters;
        paused: boolean;
    };
};
export declare type Track = {
    producer?: MediaSoup.Producer;
    consumer?: MediaSoup.Consumer;
    localPause: boolean;
    globalPause: boolean;
};
export declare class SFU {
    readonly id: SfuID;
    private readonly store;
    readonly url: string;
    private readonly device;
    private readonly tracks;
    private readonly promiseCompleter;
    private readonly ws;
    constructor(id: SfuID, store: Store<unknown, Action>, url: string);
    getTrack(id: ProducerID): Promise<MediaStreamTrack>;
    createProducer(track: MediaStreamTrack): Promise<MediaSoup.Producer>;
    private consumeTrack;
    globalPause(id: ProducerID, paused: boolean): Promise<void | Result>;
    localPause(id: ProducerID, paused: boolean): Promise<void | Result>;
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
export {};
//# sourceMappingURL=sfu.d.ts.map