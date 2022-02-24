import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackLocation } from "../../network/room";
import { Track as SfuTrack } from "../../network/sfu";
import { TrackSender } from "../../network/trackSender";
import { StreamSender, WebRtcContext, WebRtcManager } from "../rtcContext";

export const useWebRtcConstraints = (
    ctx = useContext(WebRtcContext)
) => {
    return {
        getCameraConstraints: () => ctx.cameraConstraints,
        setCameraConstraints: (
            constraints?: MediaStreamConstraints["audio"]
        ) => ctx.cameraConstraints = constraints,

        getMicrophoneConstraints: () => ctx.microphoneConstraints,
        setMicrophoneConstraints: (
            constraints?: MediaStreamConstraints["video"]
        ) => ctx.microphoneConstraints = constraints,

        getScreenshareConstraints: () => ctx.screenshareConstraints,
        setScreenshareConstraints: (
            constraints?: DisplayMediaStreamConstraints
        ) => ctx.screenshareConstraints = constraints,
    };
};

export const useCamera = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.camera);
export const useMicrophone = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.microphone);
export const useScreenshare = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.screenshare);

export type StreamNamePair = { audio: string, video: string }
export function useStream(sessionId: string, name?: string | StreamNamePair, ctx = useContext(WebRtcContext)) {
    const audioName = typeof name === "string" ? `${name}-audio` : name?.audio ?? "microphone";
    const videoName = typeof name === "string" ? `${name}-video` : name?.video ?? "camera";

    const getTracks = useCallback(
        () => {
            const tracks = ctx.room.getSessionTracks(sessionId);
            return {
                audioLocation: tracks.find(t => t.name === audioName),
                videoLocation: tracks.find(t => t.name === videoName),
            };
        },
        [ctx, sessionId, audioName, videoName], 
    );
    const [{audioLocation, videoLocation}, setLocations] = useState(getTracks);
    useEffect(() => {
        const onUpdate = () => setLocations(getTracks);
        ctx.room.on("tracksUpdated", onUpdate);
        return () => { ctx.room.off("tracksUpdated", onUpdate); };
    }, [setLocations, getTracks, ctx.room]);

    const audio = useTrack(audioLocation);
    const video = useTrack(videoLocation);

    const stream = useMediaStreamTracks(
        audio.track?.track,
        video.track?.track,
    );
    return {
        audio,
        video,
        stream,
    };
}


export const useTrack = (
    location?: TrackLocation,
    ctx = useContext(WebRtcContext),
) => {
    const {
        currentPromise: trackPromise,
        result: track
    } = useAsync(async (l?: TrackLocation) => l && (await ctx.getTrack(l)), [location]);

    const start = useAsyncCallback(async () => (await trackPromise)?.start());
    const stop = useAsyncCallback(async () => (await trackPromise)?.stop());
    return {
        track,
        hasLocation: Boolean(location),
        ...useTrackState(track),
        kind: track?.kind,
        isMine: track?.isMine,
        start,
        stop,
        pause: useAsyncCallback(async (paused: boolean) => await (paused ? stop : start).execute()),
        globalPause: useAsyncCallback(async (paused: boolean) => (await trackPromise)?.requestBroadcastStateChange(paused)),
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
    const rerender = useRerender();
    useEffect(() => {
        trackSender.on("producer", rerender);
        return () => { trackSender.off("producer", rerender); };
    }, [trackSender, rerender]);

    return {
        ...useTrackState(trackSender.producer),
        track: trackSender.producer?.track,
        start: useAsyncCallback(() => trackSender.start()),
        stop: useAsyncCallback(() => trackSender.producer?.stop()),
        globalPause: useAsyncCallback(async (paused: boolean) => trackSender.producer?.requestBroadcastStateChange(paused)),
    };
};

const useTrackState = (
    track?: SfuTrack,
) => {
    const rerender = useRerender();
    
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

    const isActiveLocally = track?.pausedLocally === false;
    const isActiveAtProducer = track?.pausedAtSource === false;
    const isActiveGlobally = isActiveAtProducer && track?.pausedGlobally === false;
    
    return {
        isConsumable: isActiveGlobally && isActiveLocally,
        isPausedLocally: track?.pausedLocally !== false,
        isPausedGlobally: track?.pausedGlobally !== false,
        isPausedAtSource: track?.pausedAtSource !== false,
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
    ...nextTrackSet: Array<MediaStreamTrack | null | undefined>
) => {
    const stream = useMemo(() => new MediaStream(), []);
    const previousTrackSet = new Set(stream.getAudioTracks());
    
    for(const track of nextTrackSet) {
        if(!track) { continue; }
        const isNewTrack = !previousTrackSet.delete(track);
        if(isNewTrack) { stream.addTrack(track); }
    }

    for(const track of previousTrackSet) {
        stream.removeTrack(track);
    }

    return stream;
};

const useRerender = () => useReducer(i => i + 1, 0)[1];