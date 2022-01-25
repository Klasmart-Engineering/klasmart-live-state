import { types as MediaSoup } from "mediasoup-client";
import { NewType } from "../types";
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
export declare class SFU {
    readonly id: SfuId;
    readonly url: string;
    getTrack(producerId: ProducerId): Promise<Producer | Consumer>;
    produceTrack(getTrack: () => Promise<MediaStreamTrack>, name: string, sessionId?: string): Promise<Producer>;
    consumeTrack(producerId: ProducerId): Promise<Consumer>;
    private readonly device;
    private readonly promiseCompleter;
    private readonly ws;
    constructor(id: SfuId, url: string);
    private readonly producers;
    private readonly consumers;
    private createProducer;
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
export declare abstract class Track {
    readonly requestBroadcastStateChange: (paused: boolean) => Promise<void | Result>;
    abstract get id(): ProducerId;
    abstract get kind(): "audio" | "video" | undefined;
    abstract get track(): MediaStreamTrack | null | undefined;
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract close(): void;
    get locallyPaused(): boolean | undefined;
    get sourceIsPaused(): boolean | undefined;
    get broadcastIsPaused(): boolean | undefined;
    get sinkIsPaused(): boolean | undefined;
    readonly on: EventEmitter<TrackEventMap>["on"];
    readonly off: EventEmitter<TrackEventMap>["off"];
    protected readonly emitter: EventEmitter<TrackEventMap, any>;
    protected _locallyPaused?: boolean;
    protected _sourceIsPaused?: boolean;
    protected _broadcastIsPaused?: boolean;
    protected _sinkIsPaused?: boolean;
    constructor(requestBroadcastStateChange: (paused: boolean) => Promise<void | Result>);
}
export declare class Producer extends Track {
    private readonly producer;
    private readonly getTrack;
    get id(): ProducerId;
    get kind(): "audio" | "video";
    get track(): MediaStreamTrack | null;
    start(): Promise<void>;
    stop(): Promise<void>;
    close(): void;
    set broadcastIsPaused(pause: boolean);
    constructor(producer: MediaSoup.Producer, getTrack: () => Promise<MediaStreamTrack>, requestBroadcastStateChange: (paused: boolean) => Promise<void | Result>);
    private setLocallyPaused;
    private updatePauseState;
}
export declare class Consumer extends Track {
    private consumer;
    get id(): ProducerId;
    get kind(): "audio" | "video" | undefined;
    get track(): MediaStreamTrack;
    start(): Promise<void>;
    stop(): Promise<void>;
    close(): void;
    set sourceIsPaused(paused: boolean);
    set broadcastIsPaused(pause: boolean);
    set sinkIsPaused(pause: boolean);
    constructor(consumer: MediaSoup.Consumer, requestBroadcastStateChange: (paused: boolean) => Promise<void | Result>);
    private setLocallyPaused;
    private updatePauseState;
}
export declare type TrackEventMap = {
    close: () => void;
    locallyPaused: (paused: boolean) => void;
    sourceIsPaused: (paused: boolean) => void;
    broadcastIsPaused: (paused: boolean) => void;
    sinkIsPaused: (paused: boolean) => void;
};
export {};
//# sourceMappingURL=sfu.d.ts.map