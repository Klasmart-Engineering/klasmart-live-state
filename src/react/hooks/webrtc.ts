import { useContext, useEffect, useMemo, useReducer } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackLocation } from "../../network/room";
import { Track as SfuTrack } from "../../network/track";
import {TrackSender} from "../../network/trackSender";
import {WebRtcContext} from "../rtcContext";

export function useWebRtcConstraints(
    ctx = useContext(WebRtcContext)
) {
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
}

export function useCamera(ctx = useContext(WebRtcContext)) {
    console.log("useCamera");
    const sender = ctx.getCamera();
    return useTrackSender(sender);
}

export function useMicrophone(ctx = useContext(WebRtcContext)) {
    console.log("useMicrophone");
    const sender = ctx.getMicrophone();
    return useTrackSender(sender);
}

export function useScreenshare(ctx = useContext(WebRtcContext)) {
    console.log("useScreenshare");
    const sender = ctx.getScreenshare();
    return useTrackSender(sender);
}

export type StreamNamePair = { audio: string, video: string, screenshare?: string }
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


export function useTrack(
    location?: TrackLocation,
    ctx = useContext(WebRtcContext),
) {
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
        globalPause: useAsyncCallback(async (paused: boolean) => {
            const track = (await trackPromise);
            if (track) track.pausedGlobally = paused;
        }),
    };
}

export type Track = ReturnType<typeof useTrack>;

function useTrackSender (
    trackSender: TrackSender,
) {
    const rerender = useRerender();
    useEffect(() => {
        function onStateChange() {
            return rerender();
        }
        trackSender.on("statechange", onStateChange);

        return () => {
            trackSender.off("statechange", onStateChange);
        };
    }, [trackSender, rerender]);

    return {
        ...useTrackState(trackSender.producer),
        track: trackSender.producer?.track,

        setSending: useAsyncCallback(async (send: boolean) => {
            if (send) {
                await trackSender.creating();
                return await trackSender.sending();
            }
            return await trackSender.notSending();
        }),
        globalPause: useAsyncCallback(async (paused: boolean) => {
            const producer = trackSender.producer;
            if (producer) producer.pausedGlobally = paused;
        }),

        getMaxWidth: () => trackSender.maxWidth,
        setMaxWidth: (max?: number) => { trackSender.maxWidth = max; },

        getMaxHeight: () => trackSender.maxHeight,
        setMaxHeight: (max?: number) => { trackSender.maxHeight = max; },

        getMaxFramerate: () => trackSender.maxFramerate,
        setMaxFramerate: (max?: number) => { trackSender.maxFramerate = max; },
    };
}

function useTrackState(
    track?: SfuTrack,
) {
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

    if (!track) return {
        isConsumable: false,
        isPausedLocally: true,
        isPausedGlobally: false,
        isPausedAtSource: true
    };

    const isActiveLocally = !track.pausedLocally;
    const isActiveAtProducer = track.pausedAtSource === false;
    const isActiveGlobally = isActiveAtProducer && track.pausedGlobally === false;
    const isConsumable = (isActiveLocally && isActiveGlobally) || (track.isMine && isActiveLocally);

    return {
        isConsumable,
        isPausedLocally: track.pausedLocally,
        isPausedGlobally: track.pausedGlobally !== false,
        isPausedAtSource: track.pausedAtSource !== false,
    };
}

export function useMediaStreamTracks(
    ...nextTrackSet: Array<MediaStreamTrack | null | undefined>
) {
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
}

export function useWebrtcCloseCallback(
    ctx = useContext(WebRtcContext),
){
    return useAsyncCallback(() => ctx.close());
}

export function useWebrtcClose(
    ctx = useContext(WebRtcContext),
) {
    return useAsync(() => ctx.close(), []);
}

function useRerender() {
    return useReducer(i => i + 1, 0)[1];
}
