import { types as MediaSoup } from "mediasoup-client";
import { NewType } from "../types";
import { Store } from "@reduxjs/toolkit";
import { Action } from "../redux/reducer";
import EventEmitter from "eventemitter3";
export declare type SfuId = NewType<string, "sfuId">;
export declare const newSfuID: (id: string) => SfuId;
export declare type ProducerId = NewType<string, "producerId">;
export declare const newProducerID: (id: string) => ProducerId;
export declare type ConsumerId = NewType<string, "consumerId">;
export declare const newConsumerID: (id: string) => ConsumerId;
export declare type RequestId = NewType<string, "requestId">;
export declare const newRequestID: (id: string) => RequestId;
export declare type RequestMessage = {
    id: RequestId;
    request: Request;
};
declare type Request = {
    getRouterRtpCapabilities?: unknown;
    createProducerTransport?: unknown;
    connectProducerTransport?: TransportConnectRequest;
    produceTrack?: ProduceTrackRequest;
    setRtpCapabilities?: MediaSoup.RtpCapabilities;
    createConsumerTransport?: unknown;
    connectConsumerTransport?: TransportConnectRequest;
    consumeTrack?: ConsumeTrackRequest;
    pause?: PauseRequest;
    pauseForEveryone?: PauseRequest;
    endRoom?: unknown;
};
declare type TransportConnectRequest = {
    dtlsParameters: MediaSoup.DtlsParameters;
};
declare type ProduceTrackRequest = {
    kind: MediaSoup.MediaKind;
    rtpParameters: MediaSoup.RtpParameters;
    name: string;
};
declare type ConsumeTrackRequest = {
    producerId: ProducerId;
};
declare type PauseRequest = {
    paused: boolean;
    id: ProducerId;
};
export declare type ResponseMessage = {
    response?: Response;
    sourcePauseEvent?: PauseEvent;
    broadcastPauseEvent?: PauseEvent;
    sinkPauseEvent?: PauseEvent;
    consumerClosed?: ProducerId;
    producerClosed?: ProducerId;
    consumerTransportClosed?: unknown;
    producerTransportClosed?: unknown;
};
declare type Response = {
    id: RequestId;
    error: string;
} | {
    id: RequestId;
    result: Result | void;
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
    producerTransportCreated?: WebRtcTransportResult;
    producerCreated?: ProducerId;
    consumerTransportCreated?: WebRtcTransportResult;
    consumerCreated?: {
        id: ConsumerId;
        producerId: ProducerId;
        kind: MediaSoup.MediaKind;
        rtpParameters: MediaSoup.RtpParameters;
    };
};
export declare type PauseEvent = {
    producerId: ProducerId;
    paused: boolean;
};
export declare type TrackLocation = {
    sfuId: SfuId;
    producerId: ProducerId;
};
export declare class SFU {
    readonly id: SfuId;
    private readonly store;
    readonly url: string;
    private readonly device;
    private readonly promiseCompleter;
    private readonly ws;
    constructor(id: SfuId, store: Store<unknown, Action>, url: string);
    private readonly states;
    createProducer(track: MediaStreamTrack, name: string): Promise<ProducerStateWriteable>;
    private createConsumer;
    changeBroadcastState(id: ProducerId, paused: boolean): Promise<void | Result>;
    setPauseState(id: ProducerId, paused: boolean): Promise<void | Result>;
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
    private onSourcePaused;
    private onBroadcastPaused;
    private onSinkPaused;
}
export declare class ProducerState {
    sfu: SFU;
    protected _producer: MediaSoup.Producer;
    get producer(): MediaSoup.Producer;
    get id(): ProducerId;
    get sourceIsPaused(): boolean;
    get broadcastIsPaused(): boolean | undefined;
    constructor(sfu: SFU, _producer: MediaSoup.Producer);
    readonly on: EventEmitter<ProducerStateEventMap>["on"];
    readonly off: EventEmitter<ProducerStateEventMap>["off"];
    protected getState(): this;
    protected readonly emitter: EventEmitter<ProducerStateEventMap, any>;
    protected _broadcastIsPaused?: boolean;
}
declare class ProducerStateWriteable extends ProducerState {
    getObserver(): this;
    close(): void;
    set broadcastIsPaused(pause: boolean);
}
export declare type ProducerStateEventMap = {
    close: () => void;
    sourceIsPaused: (paused?: boolean) => void;
    broadcastIsPaused: (paused?: boolean) => void;
};
export declare class ConsumerState {
    get consumer(): MediaSoup.Consumer | undefined;
    get id(): ProducerId | undefined;
    get sourceIsPaused(): boolean | undefined;
    get broadcastIsPaused(): boolean | undefined;
    get sinkIsPaused(): boolean | undefined;
    readonly on: EventEmitter<ConsumerStateEventMap>["on"];
    readonly off: EventEmitter<ConsumerStateEventMap>["off"];
    protected getState(): this;
    protected readonly emitter: EventEmitter<ConsumerStateEventMap, any>;
    protected _consumer?: MediaSoup.Consumer;
    protected _sourceIsPaused?: boolean;
    protected _broadcastIsPaused?: boolean;
    protected _sinkIsPaused?: boolean;
}
export declare class ConsumerStateWriteable extends ConsumerState {
    getObserver(): this;
    close(): void;
    set consumer(consumer: MediaSoup.Consumer);
    set sourceIsPaused(paused: boolean);
    set broadcastIsPaused(pause: boolean);
    set sinkIsPaused(pause: boolean);
}
export declare type ConsumerStateEventMap = {
    close: () => void;
    sourceIsPaused: (paused?: boolean) => void;
    broadcastIsPaused: (paused?: boolean) => void;
    sinkIsPaused: (paused?: boolean) => void;
};
export {};
//# sourceMappingURL=sfu.d.ts.map