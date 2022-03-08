import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackLocation } from "../../network/room";
import { Track as SfuTrack } from "../../network/sfu";
import { TrackSender } from "../../network/trackSender";
import { WebRtcContext } from "../rtcContext";

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
        return () => { ctx.room.off("tracksUpdated", onUpdate);};
    }, [setLocations, getTracks, ctx.room]);
    
    useEffect(() => {
        // This useEffect should be removed once there is time to refactor
        if(sessionId !== ctx.sessionId) { return; }
        const onUpdate = () => setLocations(getTracks);
        const senders = [
            ctx.camera,
            ctx.microphone,
            ctx.screenshare,
        ];
        senders.forEach(sender => sender.on("statechange", onUpdate));
        return () => senders.forEach(sender => sender.off("statechange", onUpdate));
    }, [setLocations, getTracks, sessionId]);

    const audio = useTrack(audioLocation, ctx);
    const video = useTrack(videoLocation, ctx);

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

const useTrackSender = (
    trackSender: TrackSender,
) => {
    const rerender = useRerender();
    useEffect(() => {
        trackSender.on("statechange", rerender);
        return () => { trackSender.off("statechange", rerender); };
    }, [trackSender, rerender]);

    return {
        ...useTrackState(trackSender.producer),
        track: trackSender.producer?.track,
        setSending: useAsyncCallback((send: boolean) => trackSender.changeState(send ? "sending" : "not-sending")),
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

export const useMediaStreamTracks = (
    ...nextTrackSet: Array<MediaStreamTrack | null | undefined>
) => {
    const stream = useMemo(() => new MediaStream(), []);
    const previousTrackSet = new Set(stream.getTracks());
    
    for(const track of nextTrackSet) {
        if(!track || track.readyState !== "live") { continue; }
        const isNewTrack = !previousTrackSet.delete(track);
        if(isNewTrack) { stream.addTrack(track); }
    }

    for(const track of previousTrackSet) {
        stream.removeTrack(track);
    }

    return stream;
};

export const useCloseWebrtc = (
    ctx = useContext(WebRtcContext),
) => useAsyncCallback(() => ctx.close());

const useRerender = () => useReducer(i => i + 1, 0)[1];
