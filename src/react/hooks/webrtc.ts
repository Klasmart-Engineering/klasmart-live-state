import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { useSelector } from "react-redux";
import { TrackLocation } from "../../network/sfu";
import { TrackSender } from "../../network/trackSender";
import { State } from "../../redux/reducer";
import { StreamSender, WebRtcContext } from "../rtcContext";

export const useCamera = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.camera, ctx);
export const useMicrophone = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.microphone, ctx);
export const useScreenshare = (ctx = useContext(WebRtcContext)) => useStreamSender(ctx.screenshare, ctx);

export const useStream = (
    audioLocation?: TrackLocation,
    videoLocation?: TrackLocation,
    ctx = useContext(WebRtcContext),
) => {
    const audioTrack = useAsync(async (l?: TrackLocation) => l && ctx.getTrack(l), [audioLocation]);
    const videoTrack = useAsync(async (l?: TrackLocation) => l && ctx.getTrack(l), [videoLocation]);
    return useMediaStreamTracks([audioTrack.result, videoTrack.result]);
};

export const useTrack = (
    location: TrackLocation,
    ctx = useContext(WebRtcContext),
) => ({
    track: useAsync((l: TrackLocation) => ctx.getTrack(l), [location]),
    paused: useTrackSenderPauseState(location, ctx),
    localPause: useAsyncCallback((paused: boolean) => ctx.pause(location, paused)),
    globalPause: useAsyncCallback((paused: boolean) => ctx.pauseForEveryone(location, paused)),
});

const useStreamSender = (
    streamSender: StreamSender,
    ctx = useContext(WebRtcContext),
) => ({
    start: useAsyncCallback(() => streamSender.start()),
    stop: useAsyncCallback(() => streamSender.stop()),
    videoPaused: useTrackSenderPauseState(streamSender.videoSender, ctx),
    audioPaused: useTrackSenderPauseState(streamSender.audioSender, ctx),
    stream: useMediaStreamTracks([streamSender.audioSender.track, streamSender.videoSender.track]),
});

const useTrackSender = (
    trackSender: TrackSender,
    ctx = useContext(WebRtcContext),
) => ({
    isSending: trackSender.isSending,
    paused: useTrackSenderPauseState(trackSender, ctx),
    stream: useMediaStreamTracks([trackSender.track]),

    start: useAsyncCallback(() => trackSender.start()),
    stop: useAsyncCallback(() => trackSender.stop()),
});

const useTrackSenderPauseState = (
    trackSender: TrackSender,
    ctx = useContext(WebRtcContext),
) => {
    const [,forceRerender] = useReducer(i=>i++, 0);
    useEffect(() => {
        trackSender.on("sourcePauseChange", forceRerender);
        trackSender.on("broadcastPauseChange", forceRerender);
        trackSender.on("sinkPauseChange", forceRerender);
        return () => {
            trackSender.off("sourcePauseChange", forceRerender);
            trackSender.off("broadcastPauseChange", forceRerender);
            trackSender.off("sinkPauseChange", forceRerender);
        };
    });
    return {
        "sourcePaused": trackSender.sourceIsPaused,
        "broadcastPaused": trackSender.broadcastIsPaused,
        "sinkPaused": trackSender.sinkIsPaused,
    };
};

export const useMediaStreamTracks = (
    tracks: Array<MediaStreamTrack|undefined|null>
) => useMemo(() => {
    const validTracks = filterFalsy(tracks);
    if(validTracks.length <= 0) {return;}
    return new MediaStream(validTracks);
}, tracks);

function useWebRtcState<T = unknown>(
    selector: (state: State) => T,
    equalityCheck?: (left: T, right: T) => boolean,
    webrtc = useContext(WebRtcContext),
) {
    return useSelector(
        (state) => selector(webrtc.selector(state)),
        equalityCheck,
    );
}

const filterFalsy = <T extends object>(items: Array<T|undefined|null>) => 
    items.filter((x): x is T => Boolean(x));