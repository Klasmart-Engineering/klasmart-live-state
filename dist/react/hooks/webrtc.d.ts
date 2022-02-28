import { TrackLocation } from "../../network/room";
export declare const useWebRtcConstraints: (ctx?: import("../rtcContext").WebRtcManager) => {
    getCameraConstraints: () => boolean | MediaTrackConstraints | undefined;
    setCameraConstraints: (constraints?: MediaStreamConstraints["audio"]) => boolean | MediaTrackConstraints | undefined;
    getMicrophoneConstraints: () => boolean | MediaTrackConstraints | undefined;
    setMicrophoneConstraints: (constraints?: MediaStreamConstraints["video"]) => boolean | MediaTrackConstraints | undefined;
    getScreenshareConstraints: () => DisplayMediaStreamConstraints | undefined;
    setScreenshareConstraints: (constraints?: DisplayMediaStreamConstraints | undefined) => DisplayMediaStreamConstraints | undefined;
};
export declare const useCamera: (ctx?: import("../rtcContext").WebRtcManager) => {
    track: MediaStreamTrack | null | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    globalPause: import("react-async-hook").UseAsyncReturn<void | import("../../network/sfu").Result | undefined, [paused: boolean]>;
    isConsumable: boolean;
    isPausedLocally: boolean;
    isPausedGlobally: boolean;
    isPausedAtSource: boolean;
};
export declare const useMicrophone: (ctx?: import("../rtcContext").WebRtcManager) => {
    track: MediaStreamTrack | null | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    globalPause: import("react-async-hook").UseAsyncReturn<void | import("../../network/sfu").Result | undefined, [paused: boolean]>;
    isConsumable: boolean;
    isPausedLocally: boolean;
    isPausedGlobally: boolean;
    isPausedAtSource: boolean;
};
export declare const useScreenshare: (ctx?: import("../rtcContext").WebRtcManager) => {
    track: MediaStreamTrack | null | undefined;
    start: import("react-async-hook").UseAsyncReturn<void, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    globalPause: import("react-async-hook").UseAsyncReturn<void | import("../../network/sfu").Result | undefined, [paused: boolean]>;
    isConsumable: boolean;
    isPausedLocally: boolean;
    isPausedGlobally: boolean;
    isPausedAtSource: boolean;
};
export declare type StreamNamePair = {
    audio: string;
    video: string;
};
export declare function useStream(sessionId: string, name?: string | StreamNamePair, ctx?: import("../rtcContext").WebRtcManager): {
    audio: {
        kind: "audio" | "video" | undefined;
        isMine: boolean | undefined;
        start: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
        stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
        pause: import("react-async-hook").UseAsyncReturn<void | undefined, [paused: boolean]>;
        globalPause: import("react-async-hook").UseAsyncReturn<void | import("../../network/sfu").Result | undefined, [paused: boolean]>;
        isConsumable: boolean;
        isPausedLocally: boolean;
        isPausedGlobally: boolean;
        isPausedAtSource: boolean;
        track: import("../../network/sfu").Producer | import("../../network/sfu").Consumer | undefined;
        hasLocation: boolean;
    };
    video: {
        kind: "audio" | "video" | undefined;
        isMine: boolean | undefined;
        start: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
        stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
        pause: import("react-async-hook").UseAsyncReturn<void | undefined, [paused: boolean]>;
        globalPause: import("react-async-hook").UseAsyncReturn<void | import("../../network/sfu").Result | undefined, [paused: boolean]>;
        isConsumable: boolean;
        isPausedLocally: boolean;
        isPausedGlobally: boolean;
        isPausedAtSource: boolean;
        track: import("../../network/sfu").Producer | import("../../network/sfu").Consumer | undefined;
        hasLocation: boolean;
    };
    stream: MediaStream;
};
export declare const useTrack: (location?: TrackLocation | undefined, ctx?: import("../rtcContext").WebRtcManager) => {
    kind: "audio" | "video" | undefined;
    isMine: boolean | undefined;
    start: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    stop: import("react-async-hook").UseAsyncReturn<void | undefined, []>;
    pause: import("react-async-hook").UseAsyncReturn<void | undefined, [paused: boolean]>;
    globalPause: import("react-async-hook").UseAsyncReturn<void | import("../../network/sfu").Result | undefined, [paused: boolean]>;
    isConsumable: boolean;
    isPausedLocally: boolean;
    isPausedGlobally: boolean;
    isPausedAtSource: boolean;
    track: import("../../network/sfu").Producer | import("../../network/sfu").Consumer | undefined;
    hasLocation: boolean;
};
export declare type Track = ReturnType<typeof useTrack>;
export declare const useMediaStreamTracks: (...nextTrackSet: Array<MediaStreamTrack | null | undefined>) => MediaStream;
//# sourceMappingURL=webrtc.d.ts.map