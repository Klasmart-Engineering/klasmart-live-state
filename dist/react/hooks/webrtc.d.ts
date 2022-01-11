import { ProducerId, SfuId } from "../../network/sfu";
export declare type TrackLocation = {
    sfuId: SfuId;
    producerId: ProducerId;
};
export declare const useCamera: (ctx?: import("../rtcContext").WebRtcManager) => {
    paused: {
        locally: boolean | undefined;
        atSource: boolean | undefined;
        atBroadcast: boolean | undefined;
        atSink: boolean | undefined;
    };
    stream: MediaStream | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    location: {
        sfuId: SfuId;
        producerId: ProducerId;
    } | undefined;
    globalPause: import("react-async-hook").UseAsyncReturn<void | {
        routerRtpCapabilities?: import("mediasoup-client/lib/RtpParameters").RtpCapabilities | undefined;
        producerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        producerCreated?: ProducerId | undefined;
        consumerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        consumerCreated?: {
            id: import("../../network/sfu").ConsumerId;
            producerId: ProducerId;
            kind: import("mediasoup-client/lib/RtpParameters").MediaKind;
            rtpParameters: import("mediasoup-client/lib/RtpParameters").RtpParameters;
        } | undefined;
    } | undefined, [paused: boolean]>;
};
export declare const useMicrophone: (ctx?: import("../rtcContext").WebRtcManager) => {
    paused: {
        locally: boolean | undefined;
        atSource: boolean | undefined;
        atBroadcast: boolean | undefined;
        atSink: boolean | undefined;
    };
    stream: MediaStream | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    location: {
        sfuId: SfuId;
        producerId: ProducerId;
    } | undefined;
    globalPause: import("react-async-hook").UseAsyncReturn<void | {
        routerRtpCapabilities?: import("mediasoup-client/lib/RtpParameters").RtpCapabilities | undefined;
        producerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        producerCreated?: ProducerId | undefined;
        consumerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        consumerCreated?: {
            id: import("../../network/sfu").ConsumerId;
            producerId: ProducerId;
            kind: import("mediasoup-client/lib/RtpParameters").MediaKind;
            rtpParameters: import("mediasoup-client/lib/RtpParameters").RtpParameters;
        } | undefined;
    } | undefined, [paused: boolean]>;
};
export declare const useScreenshare: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    videoPaused: {
        locally: boolean | undefined;
        atSource: boolean | undefined;
        atBroadcast: boolean | undefined;
        atSink: boolean | undefined;
    };
    audioPaused: {
        locally: boolean | undefined;
        atSource: boolean | undefined;
        atBroadcast: boolean | undefined;
        atSink: boolean | undefined;
    };
    stream: MediaStream | undefined;
};
export declare const useStream: (audioLocation?: TrackLocation | undefined, videoLocation?: TrackLocation | undefined, ctx?: import("../rtcContext").WebRtcManager) => MediaStream | undefined;
export declare const useTrack: (location?: TrackLocation | undefined, ctx?: import("../rtcContext").WebRtcManager) => {
    stream: MediaStream | undefined;
    kind: "audio" | "video" | undefined;
    pause: {
        locally: boolean | undefined;
        atSource: boolean | undefined;
        atBroadcast: boolean | undefined;
        atSink: boolean | undefined;
    };
    start: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    globalPause: import("react-async-hook").UseAsyncReturn<void | {
        routerRtpCapabilities?: import("mediasoup-client/lib/RtpParameters").RtpCapabilities | undefined;
        producerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        producerCreated?: ProducerId | undefined;
        consumerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        consumerCreated?: {
            id: import("../../network/sfu").ConsumerId;
            producerId: ProducerId;
            kind: import("mediasoup-client/lib/RtpParameters").MediaKind;
            rtpParameters: import("mediasoup-client/lib/RtpParameters").RtpParameters;
        } | undefined;
    } | undefined, [paused: boolean]>;
};
export declare const useMediaStreamTracks: (...tracks: Array<MediaStreamTrack | null | undefined>) => MediaStream | undefined;
//# sourceMappingURL=webrtc.d.ts.map