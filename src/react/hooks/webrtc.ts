import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { Track, TrackLocation } from "../../network/sfu";
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
    videoPaused: useProducerPauseState(streamSender.videoSender.track),
    audioPaused: useProducerPauseState(streamSender.audioSender.track),
    stream: useMediaStreamTracks(filterFalsy([
        streamSender.audioSender.track?.track,
        streamSender.videoSender.track?.track,
    ])),
});

const useTrackSender = (
    trackSender: TrackSender,
) => {
    return {
        paused: useProducerPauseState(trackSender.track),
        stream: useMediaStreamTracks(filterFalsy([trackSender.track?.track])),

    };
};

const useTrackPauseState = (
    track?: Track,
) => {
    const rerender = useRerender();
    
    useEffect(() => {
        if(!track) { return; }
        track.on("locallyPaused", rerender);
        track.on("sourceIsPaused", rerender);
        track.on("broadcastIsPaused", rerender);
        track.on("sinkIsPaused", rerender);
        return () => {
            track.off("locallyPaused", rerender);
            track.off("sourceIsPaused", rerender);
            track.off("broadcastIsPaused", rerender);
            track.off("sinkIsPaused", rerender);
        };
    });


    const start = useAsyncCallback(() => track?.start());
    // const globalPause = useAsyncCallback(() => track?.requestBroadcastStateChange(true));
    // const globalResume = useAsyncCallback(() => track?.requestBroadcastStateChange(false));
    const stop = useAsyncCallback(() => track?.stop());

    
    if(!track) { return; }
    const {
        sourceIsPaused,
        broadcastIsPaused,
        sinkIsPaused,   
    } = track;
    return {
        sourceIsPaused,
        broadcastIsPaused,
        sinkIsPaused,
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