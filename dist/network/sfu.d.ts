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
    private _ready;
    constructor(id: SfuID, store: Store<ApplicationState, Action>, selector: (s: ApplicationState) => State, url: string);
    getTrack(id: ProducerID): Promise<MediaStreamTrack>;
    produceTrack(track: MediaStreamTrack): Promise<MediaSoup.Producer>;
    private ready;
    private setReady;
    private consumeTrack;
    private consumerTransport;
    private producerTransport;
    private sendRtpCapabilities;
    private loadDevice;
    private request;
    private requestId;
    private generateRequestId;
    private onTransportStateChange;
    private onTransportMessage;
    private static parse;
    private handleMessage;
    private response;
    private closeTrack;
    private setTrack;
    private handlePauseMessage;
    /** Decorator that waits for the SFU to be ready before executing the decorated function.  Converts any function to an `async`
     *  function, so be sure to `await` for the result. */
    private static WaitReady;
}
/**
 *  Decorator that ensures the decorated function body is executed only once, unless the function throws an error.
 *  All subsequent calls return the same value as the first call
 **/
export declare function ExecuteOnce(): (_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=sfu.d.ts.map