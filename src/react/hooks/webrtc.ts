import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { ProducerId, SfuId, Track } from "../../network/sfu";
import { TrackSender } from "../../network/trackSender";
import { StreamSender, WebRtcContext } from "../rtcContext";

export type TrackLocation = { sfuId: SfuId, producerId: ProducerId }

export const useCamera = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.camera);
export const useMicrophone = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.microphone);
export const useScreenshare = (ctx = useContext(WebRtcContext)) => useStreamSender(ctx.screenshare);

export const useStream = (
    audioLocation?: TrackLocation,
    videoLocation?: TrackLocation,
    ctx = useContext(WebRtcContext),
) => {
    const audioTrack = useAsync(async (l?: TrackLocation) => l && (await ctx.getTrack(l))?.track, [audioLocation]);
    const videoTrack = useAsync(async (l?: TrackLocation) => l && (await ctx.getTrack(l))?.track, [videoLocation]);
    return useMediaStreamTracks(filterFalsy([audioTrack.result, videoTrack.result]));
};

export const useTrack = (
    location?: TrackLocation,
    ctx = useContext(WebRtcContext),
) => {
    const track = useAsync(async (l?: TrackLocation) => l && (await ctx.getTrack(l)), [location]);

    return {
        stream: useMediaStreamTracks(filterFalsy([track.result?.track])),
        kind: track.result?.kind,
        pause: useTrackPauseState(track.result),
        start: useAsyncCallback(async () => (await track.currentPromise)?.start()),
        stop: useAsyncCallback(async () => (await track.currentPromise)?.stop()),
        globalPause: useAsyncCallback(async (paused: boolean) => (await track.currentPromise)?.requestBroadcastStateChange(paused)),
    };
};

const useStreamSender = (
    streamSender: StreamSender,
) => ({
    start: useAsyncCallback(() => streamSender.start()),
    stop: useAsyncCallback(() => streamSender.stop()),
    videoPaused: useTrackPauseState(streamSender.videoSender.producer),
    audioPaused: useTrackPauseState(streamSender.audioSender.producer),
    stream: useMediaStreamTracks(filterFalsy([
        streamSender.audioSender.producer?.track,
        streamSender.videoSender.producer?.track,
    ])),
});

const useTrackSender = (
    trackSender: TrackSender,
) => {
    return {
        paused: useTrackPauseState(trackSender.producer),
        stream: useMediaStreamTracks(filterFalsy([trackSender.producer?.track])),
        start: useAsyncCallback(() => trackSender.start()),
        stop: useAsyncCallback(() => trackSender.producer?.stop()),
        location: trackSender.location,
        globalPause: useAsyncCallback(async (paused: boolean) => trackSender.producer?.requestBroadcastStateChange(paused)),
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
    
    return {
        locally: track?.locallyPaused,
        atSource: track?.sourceIsPaused,
        atBroadcast: track?.broadcastIsPaused,
        atSink: track?.sinkIsPaused,
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