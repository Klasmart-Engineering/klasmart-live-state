import {NewType} from "../types";
import {types as MediaSoup} from "mediasoup-client";
import {RtpEncodingParameters} from "mediasoup-client/lib/RtpParameters";

export type SfuId = NewType<string, "sfuId">
export const newSfuID = (id: string) => id as SfuId;

export type ProducerId = NewType<string, "producerId">
export const newProducerID = (id: string) => id as ProducerId;

export type ConsumerId = NewType<string, "consumerId">
export const newConsumerID = (id: string) => id as ConsumerId;

export type RequestId = NewType<string, "requestId">
export const newRequestID = (id: string) => id as RequestId;

export type RequestMessage = {
    id: RequestId,
    request: Request,
}

export type Request = {
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
}

type TransportConnectRequest = { dtlsParameters: MediaSoup.DtlsParameters };
export type ProduceTrackRequest = { kind: MediaSoup.MediaKind, rtpParameters: MediaSoup.RtpParameters, name: string };
type ConsumeTrackRequest = { producerId: ProducerId };
type PauseRequest = { paused: boolean, id: ProducerId };

export type ResponseMessage = {
    clientId?: ClientId,
    response?: Response,

    pausedSource?: PauseEvent,
    pausedGlobally?: PauseEvent,

    consumerClosed?: ProducerId,
    producerClosed?: ProducerId,

    consumerTransportClosed?: unknown,
    producerTransportClosed?: unknown,
}

export type Response = {
    id: RequestId;
    error: string,
} | {
    id: RequestId;
    result: Result | void,
}

export type WebRtcTransportResult = {
    id: string,
    iceCandidates: MediaSoup.IceCandidate[],
    iceParameters: MediaSoup.IceParameters,
    dtlsParameters: MediaSoup.DtlsParameters,
    sctpParameters?: MediaSoup.SctpParameters,
}

export type Result = {
    routerRtpCapabilities?: MediaSoup.RtpCapabilities;

    producerTransportCreated?: WebRtcTransportResult;
    producerCreated?: {
        producerId: ProducerId,
        pausedGlobally: boolean,
    };

    consumerTransportCreated?: WebRtcTransportResult;
    consumerCreated?: {
        id: ConsumerId,
        producerId: ProducerId,
        kind: MediaSoup.MediaKind,
        rtpParameters: MediaSoup.RtpParameters,
    },
}

export type PauseEvent = {
    producerId: ProducerId,
    paused: boolean
}

export type ClientId = NewType<string, "ClientId">;
export function newClientId(id: string) { return id as ClientId; }

export type ProducerParameters = {
    track: MediaStreamTrack,
    encodings?: RtpEncodingParameters[],
};


type SfuAuthError = Error & {
    code: number;
}

export type AuthenticationError = SfuAuthError & {
    name: "AuthenticationError";
};

export type AuthorizationError = SfuAuthError & {
    name: "AuthorizationError";
};

export type TokenMismatchError = SfuAuthError & {
    name: "TokenMismatchError";
};

export type MissingAuthenticationError = SfuAuthError & {
    name: "MissingAuthenticationError";
};

export type MissingAuthorizationError = SfuAuthError & {
    name: "MissingAuthorizationError";
};

export type SfuAuthErrors = AuthenticationError | AuthorizationError | TokenMismatchError | MissingAuthenticationError | MissingAuthorizationError;

export class SfuConnectionError implements Error {
    public readonly name = "SfuConnectionError";
    constructor(
        public readonly message: string,
        public readonly retries: number,
        public readonly id: SfuId,
        public readonly producerError: boolean = false) {}
}

export type SfuEventMap = {
    authError: (error: SfuAuthErrors) => void,
    connectionError: (error: SfuConnectionError) => void,
}
