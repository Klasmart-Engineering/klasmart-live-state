import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackLocation } from "../../network/room";
import { Track as SfuTrack } from "../../network/track";
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

    const [renderCount, rerender] = useReducer(i => i+1,0);
    const {audioLocation, videoLocation} = useMemo(
        () => {
            const tracks = ctx.room.getSessionTracks(sessionId);
            return {
                audioLocation: tracks.find(t => t.name === audioName),
                videoLocation: tracks.find(t => t.name === videoName),
            };
        },
        [ctx, sessionId, audioName, videoName, renderCount],
    );

    useEffect(() => {
        ctx.room.on("tracksUpdated", rerender);
        return () => { ctx.room.off("tracksUpdated", rerender);};
    }, [ctx.room]);

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
        result: track,
        execute,
    } = useAsync(async (location?: TrackLocation) => {
        if(!location) { return; }
        const {sfuId, producerId} = location;
        return ctx.sfu(sfuId).getTrack(producerId);
    }, [location]);

    useEffect(() => {
        if(!location) { return; }
        const {sfuId, producerId} = location;
        const sfu = ctx.sfu(sfuId);
        const callback = () => execute(location);
        sfu.onTrackUpdate(producerId, callback);
        return () => { sfu.offTrackUpdate(producerId, callback); };
    });

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

        getMaxWidth: trackSender.getMaxWidth.bind(trackSender),
        setMaxWidth: trackSender.setMaxWidth.bind(trackSender),

        getMaxHeight: trackSender.getMaxHeight.bind(trackSender),
        setMaxHeight: trackSender.setMaxHeight.bind(trackSender),

        getMaxFramerate: trackSender.getMaxFramerate.bind(trackSender),
        setMaxFramerate: trackSender.setMaxFramerate.bind(trackSender),

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

    if (!track) return {
        isConsumable: false,
        isPausedLocally: true,
        isPausedGlobally: false,
        isPausedAtSource: true
    };

    return {
        isConsumable: isActiveGlobally && isActiveLocally,
        isPausedLocally: track.pausedLocally,
        isPausedGlobally: track.pausedGlobally !== false,
        isPausedAtSource: track.pausedAtSource !== false,
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

export const useWebrtcCloseCallback = (
    ctx = useContext(WebRtcContext),
) => useAsyncCallback(() => ctx.close());

export const useWebrtcClose = (
    ctx = useContext(WebRtcContext),
) => useAsync(() => ctx.close(), []);

const useRerender = () => useReducer(i => i + 1, 0)[1];
