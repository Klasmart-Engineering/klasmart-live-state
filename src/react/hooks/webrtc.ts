import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { ConsumerState, ProducerState, TrackLocation } from "../../network/sfu";
import { TrackSender } from "../../network/trackSender";
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
    localPause: useAsyncCallback((paused: boolean) => ctx.pause(location, paused)),
    globalPause: useAsyncCallback((paused: boolean) => ctx.pauseForEveryone(location, paused)),
});

const useStreamSender = (
    streamSender: StreamSender,
) => ({
    start: useAsyncCallback(() => streamSender.start()),
    stop: useAsyncCallback(() => streamSender.stop()),
    videoPaused: useProducerPauseState(streamSender.videoSender.state),
    audioPaused: useProducerPauseState(streamSender.audioSender.state),
    stream: useMediaStreamTracks(filterFalsy([
        streamSender.audioSender.state?.track,
        streamSender.videoSender.state?.track,
    ])),
});

const useTrackSender = (
    trackSender: TrackSender,
) => {
    return {
        paused: useProducerPauseState(trackSender.state),
        stream: useMediaStreamTracks(filterFalsy([trackSender.state?.track])),
        start: useAsyncCallback(() => trackSender.start()),
        stop: useAsyncCallback(() => trackSender.stop()),
    };
};

const useProducerPauseState = (
    state?: ProducerState,
) => {
    const rerender = useRerender();
    
    useEffect(() => {
        if(!state) { return; }
        state.on("locallyPaused", rerender);
        state.on("broadcastIsPaused", rerender);
        return () => {
            state.off("locallyPaused", rerender);
            state.off("broadcastIsPaused", rerender);
        };
    });

    return {
        locallyPaused: state?.sourceIsPaused,
        broadcastPaused: state?.broadcastIsPaused,
    };
};

const useConsumerPauseState = (
    state: ConsumerState,
) => {
    const rerender = useRerender();
    
    useEffect(() => {
        state.on("sourceIsPaused", rerender);
        state.on("broadcastIsPaused", rerender);
        state.on("sinkIsPaused", rerender);
        return () => {
            state.off("sourceIsPaused", rerender);
            state.off("broadcastIsPaused", rerender);
            state.off("sinkIsPaused", rerender);
        };
    });

    return {
        sourcePaused: state.sourceIsPaused,
        broadcastPaused: state.broadcastIsPaused,
        sinkIsPaused: state.sinkIsPaused,
    };
};

export const useMediaStreamTracks = (
    tracks: Array<MediaStreamTrack>
) => useMemo(() => {
    if(tracks.length <= 0) {return;}
    return new MediaStream(tracks);
}, tracks);

const useRerender = () => useReducer(i => i + 1, 0)[1];

const filterFalsy = <T extends object>(items: Array<T|undefined|null>) => 
    items.filter((x): x is T => Boolean(x));