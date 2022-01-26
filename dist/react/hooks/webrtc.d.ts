import { TrackLocation } from "../../network/room";
export declare const useCamera: (ctx?: import("../rtcContext").WebRtcManager) => {
    paused: {
        atSource: boolean | undefined;
        globally: boolean | undefined;
        locally: boolean | undefined;
    };
    stream: MediaStream | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    location: {
        sfuId: import("../../network/sfu").SfuId;
        producerId: import("../../network/sfu").ProducerId;
    } | undefined;
    globalPause: import("react-async-hook").UseAsyncReturn<void | {
        routerRtpCapabilities?: import("mediasoup-client/lib/RtpParameters").RtpCapabilities | undefined;
        producerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        producerCreated?: import("../../network/sfu").ProducerId | undefined;
        consumerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        consumerCreated?: {
            id: import("../../network/sfu").ConsumerId;
            producerId: import("../../network/sfu").ProducerId;
            kind: import("mediasoup-client/lib/RtpParameters").MediaKind;
            rtpParameters: import("mediasoup-client/lib/RtpParameters").RtpParameters;
        } | undefined;
    } | undefined, [paused: boolean]>;
};
export declare const useMicrophone: (ctx?: import("../rtcContext").WebRtcManager) => {
    paused: {
        atSource: boolean | undefined;
        globally: boolean | undefined;
        locally: boolean | undefined;
    };
    stream: MediaStream | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    location: {
        sfuId: import("../../network/sfu").SfuId;
        producerId: import("../../network/sfu").ProducerId;
    } | undefined;
    globalPause: import("react-async-hook").UseAsyncReturn<void | {
        routerRtpCapabilities?: import("mediasoup-client/lib/RtpParameters").RtpCapabilities | undefined;
        producerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        producerCreated?: import("../../network/sfu").ProducerId | undefined;
        consumerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        consumerCreated?: {
            id: import("../../network/sfu").ConsumerId;
            producerId: import("../../network/sfu").ProducerId;
            kind: import("mediasoup-client/lib/RtpParameters").MediaKind;
            rtpParameters: import("mediasoup-client/lib/RtpParameters").RtpParameters;
        } | undefined;
    } | undefined, [paused: boolean]>;
};
export declare const useScreenshare: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    videoPaused: {
        atSource: boolean | undefined;
        globally: boolean | undefined;
        locally: boolean | undefined;
    };
    audioPaused: {
        atSource: boolean | undefined;
        globally: boolean | undefined;
        locally: boolean | undefined;
    };
    stream: MediaStream | undefined;
};
export declare const useSessionTrackInfoList: (sessionId: string, ctx?: import("../rtcContext").WebRtcManager) => import("../../network/room").TrackInfo[];
export declare const useTrack: (location?: TrackLocation | undefined, ctx?: import("../rtcContext").WebRtcManager) => {
    stream: MediaStream | undefined;
    kind: "audio" | "video" | undefined;
    pause: {
        atSource: boolean | undefined;
        globally: boolean | undefined;
        locally: boolean | undefined;
    };
    start: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    globalPause: import("react-async-hook").UseAsyncReturn<void | {
        routerRtpCapabilities?: import("mediasoup-client/lib/RtpParameters").RtpCapabilities | undefined;
        producerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        producerCreated?: import("../../network/sfu").ProducerId | undefined;
        consumerTransportCreated?: import("../../network/sfu").WebRtcTransportResult | undefined;
        consumerCreated?: {
            id: import("../../network/sfu").ConsumerId;
            producerId: import("../../network/sfu").ProducerId;
            kind: import("mediasoup-client/lib/RtpParameters").MediaKind;
            rtpParameters: import("mediasoup-client/lib/RtpParameters").RtpParameters;
        } | undefined;
    } | undefined, [paused: boolean]>;
};
export declare type Track = ReturnType<typeof useTrack>;
export declare const useMediaStreamTracks: (...tracks: Array<MediaStreamTrack | null | undefined>) => MediaStream | undefined;
//# sourceMappingURL=webrtc.d.ts.map