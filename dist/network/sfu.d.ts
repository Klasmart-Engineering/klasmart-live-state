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
    pausedSource?: PauseEvent;
    pausedGlobally?: PauseEvent;
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
export declare type Result = {
    routerRtpCapabilities?: MediaSoup.RtpCapabilities;
    producerTransportCreated?: WebRtcTransportResult;
    producerCreated?: {
        producerId: ProducerId;
        pausedGlobally: boolean;
    };
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
    private _requestId;
    private readonly device;
    private readonly promiseCompleter;
    private readonly ws;
    private retryDelay;
    private retryAttempts;
    private retryMaxAttempts;
    private retryTimer?;
    private readonly producerResolvers;
    private readonly producers;
    private readonly consumers;
    emitter: EventEmitter<SfuEventMap, any>;
    constructor(id: SfuId, url: string);
    private generateRequestId;
    getTrack(producerId: ProducerId): Promise<Producer | Consumer>;
    produceTrack(getTrack: () => Promise<MediaStreamTrack>, name: string, sessionId?: string): Promise<Producer>;
    consumeTrack(producerId: ProducerId): Promise<Consumer>;
    get hasProducers(): boolean;
    close(): Promise<void>;
    private clearRetries;
    private createProducer;
    private createConsumer;
    pauseGlobally(id: ProducerId, paused: boolean): Promise<void | Result>;
    pause(id: ProducerId, paused: boolean): Promise<void | Result>;
    private consumerTransport;
    private producerTransport;
    private sendRtpCapabilities;
    private loadDevice;
    private request;
    private onTransportStateChange;
    private waitRetry;
    private onTransportMessage;
    private parse;
    private handleMessage;
    private response;
    private closeTrack;
    private onSourcePaused;
    private onGloballyPaused;
}
export declare abstract class Track {
    readonly requestBroadcastStateChange: (paused: boolean) => Promise<void | Result>;
    abstract get id(): ProducerId;
    abstract get kind(): "audio" | "video" | undefined;
    abstract get track(): MediaStreamTrack | null | undefined;
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract close(): void;
    abstract get isMine(): boolean;
    abstract get pausedLocally(): boolean;
    abstract get pausedAtSource(): boolean | undefined;
    protected _pausedGlobally?: boolean;
    get pausedGlobally(): boolean | undefined;
    set pausedGlobally(pause: boolean | undefined);
    readonly on: EventEmitter<TrackEventMap>["on"];
    readonly off: EventEmitter<TrackEventMap>["off"];
    protected readonly emitter: EventEmitter<TrackEventMap, any>;
    protected constructor(requestBroadcastStateChange: (paused: boolean) => Promise<void | Result>);
}
export declare class Producer extends Track {
    private readonly producer;
    private readonly getTrack;
    private notifyPause;
    get id(): ProducerId;
    get kind(): "audio" | "video";
    get track(): MediaStreamTrack | null;
    get isMine(): boolean;
    get pausedLocally(): boolean;
    get pausedAtSource(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    close(): void;
    constructor(producer: MediaSoup.Producer, getTrack: () => Promise<MediaStreamTrack>, notifyPause: (paused: boolean) => Promise<void | Result>, requestPauseGlobally: (paused: boolean) => Promise<void | Result>);
    private pause;
}
export declare class Consumer extends Track {
    private consumer;
    private notifyPause;
    get id(): ProducerId;
    get kind(): "audio" | "video" | undefined;
    get track(): MediaStreamTrack;
    get isMine(): boolean;
    get pausedLocally(): boolean;
    protected _pausedAtSource?: boolean;
    get pausedAtSource(): boolean | undefined;
    set pausedAtSource(paused: boolean | undefined);
    start(): Promise<void>;
    stop(): Promise<void>;
    close(): void;
    constructor(consumer: MediaSoup.Consumer, notifyPause: (paused: boolean) => Promise<void | Result>, requestPauseGlobally: (paused: boolean) => Promise<void | Result>);
    private pause;
}
export declare type TrackEventMap = {
    close: () => void;
    pausedAtSource: (paused: boolean | undefined) => void;
    pausedGlobally: (paused: boolean | undefined) => void;
    pausedLocally: (paused: boolean | undefined) => void;
};
declare type SfuAuthError = Error & {
    code: number;
};
export declare type AuthenticationError = SfuAuthError & {
    name: "AuthenticationError";
};
export declare type AuthorizationError = SfuAuthError & {
    name: "AuthorizationError";
};
export declare type TokenMismatchError = SfuAuthError & {
    name: "TokenMismatchError";
};
export declare type MissingAuthenticationError = SfuAuthError & {
    name: "MissingAuthenticationError";
};
export declare type MissingAuthorizationError = SfuAuthError & {
    name: "MissingAuthorizationError";
};
export declare type SfuAuthErrors = AuthenticationError | AuthorizationError | TokenMismatchError | MissingAuthenticationError | MissingAuthorizationError;
export declare class SfuConnectionError implements Error {
    readonly message: string;
    readonly retries: number;
    readonly id: SfuId;
    readonly producerError: boolean;
    readonly name = "SfuConnectionError";
    constructor(message: string, retries: number, id: SfuId, producerError?: boolean);
}
export declare type SfuEventMap = {
    authError: (error: SfuAuthErrors) => void;
    connectionError: (error: SfuConnectionError) => void;
};
export {};
//# sourceMappingURL=sfu.d.ts.map