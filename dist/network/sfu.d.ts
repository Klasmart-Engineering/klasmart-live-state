import { types as MediaSoup } from "mediasoup-client";
import { NewType } from "../types";
export declare type ProducerId = NewType<string, "producerId">;
export declare type Request = {
    rtpCapabilities?: MediaSoup.RtpCapabilities;
    producerTransport?: unknown;
    producerTransportConnect?: {
        dtlsParameters: MediaSoup.DtlsParameters;
    };
    createTrack?: {
        kind: MediaSoup.MediaKind;
        rtpParameters: MediaSoup.RtpParameters;
    };
    consumerTransport?: unknown;
    consumerTransportConnect?: {
        dtlsParameters: MediaSoup.DtlsParameters;
    };
    createConsumer?: {
        producerId: ProducerId;
    };
    locallyPause?: {
        paused: boolean;
        id: ProducerId;
    };
    globallyPause?: {
        paused: boolean;
        id: ProducerId;
    };
    end?: unknown;
};
export declare type WebRtcTransportResult = {
    id: string;
    iceCandidates: MediaSoup.IceCandidate[];
    iceParameters: MediaSoup.IceParameters;
    dtlsParameters: MediaSoup.DtlsParameters;
};
declare type Result = {
    producerTransport?: WebRtcTransportResult;
    consumerTransport?: WebRtcTransportResult;
};
export declare class SFU {
    readonly url: string;
    private readonly device;
    private readonly consumers;
    private readonly producers;
    private rtpCapabilities?;
    private readonly promiseCompleter;
    private readonly ws;
    constructor(url: string);
    createTracks(stream: MediaStream): void;
    createTrack(track: MediaStreamTrack): Promise<void>;
    consumeTrack(producerId: ProducerId): Promise<void>;
    private _consumerTransportPromise?;
    private _consumerTransport?;
    private consumerTransport;
    private _producerTransportPromise?;
    private _producerTransport?;
    private producerTransport;
    private sentRtpCapabilities;
    private sendRtpCapabilities;
    request(request: Request): Promise<void | Result>;
    private _requestId;
    private generateRequestId;
    private onTransportStateChange;
    private onTransportMessage;
    private parse;
    private handleMessage;
    private response;
}
export {};
//# sourceMappingURL=sfu.d.ts.map