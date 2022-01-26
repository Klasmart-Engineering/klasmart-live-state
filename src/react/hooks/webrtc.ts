import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackLocation } from "../../network/room";
import { Track as SfuTrack } from "../../network/sfu";
import { TrackSender } from "../../network/trackSender";
import { StreamSender, WebRtcContext } from "../rtcContext";


export const useCamera = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.camera);
export const useMicrophone = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.microphone);
export const useScreenshare = (ctx = useContext(WebRtcContext)) => useStreamSender(ctx.screenshare);
export const useSessionTrackInfoList = (sessionId: string, ctx = useContext(WebRtcContext)) => {
    const rerender = useRerender();
    useEffect(() => {
        ctx.room.on("tracksUpdated", rerender);
        return () => { ctx.room.off("tracksUpdated", rerender); };
    });
    return ctx.room.getSessionTracks(sessionId);
};

export const useTrack = (
    location?: TrackLocation,
    ctx = useContext(WebRtcContext),
) => {
    const track = useAsync(async (l?: TrackLocation) => l && (await ctx.getTrack(l)), [location]);
    console.log({location,track});
    return {
        stream: useMediaStreamTracks(track.result?.track),
        kind: track.result?.kind,
        pause: useTrackPauseState(track.result),
        start: useAsyncCallback(async () => (await track.currentPromise)?.start()),
        stop: useAsyncCallback(async () => (await track.currentPromise)?.stop()),
        globalPause: useAsyncCallback(async (paused: boolean) => (await track.currentPromise)?.requestBroadcastStateChange(paused)),
    };
};

export type Track = ReturnType<typeof useTrack>;

const useStreamSender = (
    streamSender: StreamSender,
) => ({
    start: useAsyncCallback(() => streamSender.start()),
    stop: useAsyncCallback(() => streamSender.stop()),
    videoPaused: useTrackPauseState(streamSender.videoSender.producer),
    audioPaused: useTrackPauseState(streamSender.audioSender.producer),
    stream: useMediaStreamTracks(
        streamSender.audioSender.producer?.track,
        streamSender.videoSender.producer?.track,
    ),
});

const useTrackSender = (
    trackSender: TrackSender,
) => {
    console.log("useTrackSender", trackSender);
    return {
        paused: useTrackPauseState(trackSender.producer),
        stream: useMediaStreamTracks(trackSender.producer?.track),
        start: useAsyncCallback(() => trackSender.start()),
        stop: useAsyncCallback(() => trackSender.producer?.stop()),
        location: trackSender.location,
        globalPause: useAsyncCallback(async (paused: boolean) => trackSender.producer?.requestBroadcastStateChange(paused)),
    };
};

const useTrackPauseState = (
    track?: SfuTrack,
) => {
    const _rerender = useRerender();
    const rerender = (e: any) => {
        console.log(`Rerender track(${track?.track?.id})`, e);
        _rerender();
    };
    
    useEffect(() => {
        if(!track) { return; }
        track.on("pausedAtSource", rerender);
        track.on("pausedGlobally", rerender);
        track.on("pausedLocally", rerender);
        return () => {
            track.off("pausedAtSource", rerender);
            track.off("pausedGlobally", rerender);
            track.off("pausedLocally", rerender);
        };
    });
    
    return {
        atSource: track?.pausedAtSource,
        globally: track?.pausedGlobally,
        locally: track?.pausedLocally,
    };
};

export const useMediaStreamTracks = (
    ...tracks: Array<MediaStreamTrack | null | undefined>
) => useMemo(() => {
    const validTracks = filterFalsy(tracks);
    if(validTracks.length <= 0) {return;}
    return new MediaStream(validTracks);
}, tracks);

const useRerender = () => useReducer(i => i + 1, 0)[1];

const filterFalsy = <T extends object>(items: Array<T|undefined|null>) => 
    items.filter((x): x is T => Boolean(x));