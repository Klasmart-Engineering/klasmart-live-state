import { TrackLocation } from "../../network/sfu";
export declare const useCamera: (ctx?: import("../rtcContext").WebRtcManager) => {
    isSending: any;
    paused: {
        sourcePaused: any;
        broadcastPaused: any;
        sinkPaused: any;
    };
    stream: MediaStream | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
};
export declare const useMicrophone: (ctx?: import("../rtcContext").WebRtcManager) => {
    isSending: any;
    paused: {
        sourcePaused: any;
        broadcastPaused: any;
        sinkPaused: any;
    };
    stream: MediaStream | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
};
export declare const useScreenshare: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    videoPaused: {
        sourcePaused: any;
        broadcastPaused: any;
        sinkPaused: any;
    };
    audioPaused: {
        sourcePaused: any;
        broadcastPaused: any;
        sinkPaused: any;
    };
    stream: MediaStream | undefined;
};
export declare const useStream: (audioLocation?: TrackLocation | undefined, videoLocation?: TrackLocation | undefined, ctx?: import("../rtcContext").WebRtcManager) => MediaStream | undefined;
export declare const useTrack: (location: TrackLocation, ctx?: import("../rtcContext").WebRtcManager) => {
    track: import("react-async-hook").UseAsyncReturn<unknown, [l: TrackLocation]>;
    paused: {
        sourcePaused: any;
        broadcastPaused: any;
        sinkPaused: any;
    };
    localPause: import("react-async-hook").UseAsyncReturn<void, [paused: boolean]>;
    globalPause: import("react-async-hook").UseAsyncReturn<void, [paused: boolean]>;
};
export declare const useMediaStreamTracks: (tracks: Array<MediaStreamTrack | undefined | null>) => MediaStream | undefined;
//# sourceMappingURL=webrtc.d.ts.map