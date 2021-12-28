import { ProducerID } from "../../network/sfu";
import { TrackLocation } from "../rtcContext";
export declare const useCamera: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    paused: import("../../ui").TrackStatus | undefined;
};
export declare const useMicrophone: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    paused: import("../../ui").TrackStatus | undefined;
};
export declare const useScreenshare: (ctx?: import("../rtcContext").WebRtcManager) => {
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void, []>;
    videoPaused: import("../../ui").TrackStatus | undefined;
    audioPaused: import("../../ui").TrackStatus | undefined;
};
export declare const useStream: (ids: ProducerID[], ctx?: import("../rtcContext").WebRtcManager) => MediaStream;
export declare const useTrack: (location: TrackLocation, ctx?: import("../rtcContext").WebRtcManager) => {
    track: import("react-async-hook").UseAsyncReturn<MediaStreamTrack, [l: TrackLocation]>;
    paused: import("../../ui").TrackStatus | undefined;
    localPause: import("react-async-hook").UseAsyncReturn<void, [paused: boolean]>;
    globalPause: import("react-async-hook").UseAsyncReturn<void, [paused: boolean]>;
};
//# sourceMappingURL=webrtc.d.ts.map