import { TrackLocation } from "../rtcContext";
export declare const useCamera: (ctx?: import("../rtcContext").WebRtcManager) => {
    isSending: boolean;
    paused: import("../../ui").TrackStatus | undefined;
    stream: MediaStream | undefined;
    location: TrackLocation | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
};
export declare const useMicrophone: (ctx?: import("../rtcContext").WebRtcManager) => {
    isSending: boolean;
    paused: import("../../ui").TrackStatus | undefined;
    stream: MediaStream | undefined;
    location: TrackLocation | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
};
export declare const useScreenshare: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    videoPaused: import("../../ui").TrackStatus | undefined;
    audioPaused: import("../../ui").TrackStatus | undefined;
    stream: MediaStream | undefined;
};
export declare const useStream: (audioLocation?: TrackLocation | undefined, videoLocation?: TrackLocation | undefined, ctx?: import("../rtcContext").WebRtcManager) => MediaStream | undefined;
export declare const useTrack: (location: TrackLocation, ctx?: import("../rtcContext").WebRtcManager) => {
    track: import("react-async-hook").UseAsyncReturn<MediaStreamTrack, [l: TrackLocation]>;
    paused: import("../../ui").TrackStatus | undefined;
    localPause: import("react-async-hook").UseAsyncReturn<void, [paused: boolean]>;
    globalPause: import("react-async-hook").UseAsyncReturn<void, [paused: boolean]>;
};
export declare const useMediaStreamTracks: (tracks: Array<MediaStreamTrack | undefined | null>) => MediaStream | undefined;
//# sourceMappingURL=webrtc.d.ts.map