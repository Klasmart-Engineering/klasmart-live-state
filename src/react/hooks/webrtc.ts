import { useContext, useMemo } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { useSelector } from "react-redux";
import { State } from "../../redux/reducer";
import { StreamSender, TrackLocation, TrackSender, WebRtcContext } from "../rtcContext";

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
    paused: useTrackPauseState(location, ctx),
    localPause: useAsyncCallback((paused: boolean) => ctx.localPause(location, paused)),
    globalPause: useAsyncCallback((paused: boolean) => ctx.globalPause(location, paused)),
});

const useStreamSender = (
    streamSender: StreamSender,
    ctx = useContext(WebRtcContext),
) => ({
    start: useAsyncCallback(() => streamSender.start()),
    stop: useAsyncCallback(() => streamSender.stop()),
    videoPaused: useTrackPauseState(streamSender.videoSender.location, ctx),
    audioPaused: useTrackPauseState(streamSender.audioSender.location, ctx),
    stream: useMediaStreamTracks([streamSender.audioSender.track, streamSender.videoSender.track]),
});

const useTrackSender = (
    trackSender: TrackSender,
    ctx = useContext(WebRtcContext),
) => ({
    isSending: trackSender.isSending,
    paused: useTrackPauseState(trackSender.location, ctx),
    stream: useMediaStreamTracks([trackSender.track]),
    location: trackSender.location,

    start: useAsyncCallback(() => trackSender.start()),
    stop: useAsyncCallback(() => trackSender.stop()),
});

export const useMediaStreamTracks = (
    tracks: Array<MediaStreamTrack|undefined|null>
) => useMemo(() => {
    const validTracks = filterFalsy(tracks);
    if(validTracks.length <= 0) {return;}
    return new MediaStream(validTracks);
}, tracks);

const useTrackPauseState = (
    location?: TrackLocation,
    ctx = useContext(WebRtcContext),
) => useWebRtcState(
    s => {
        if(!location) {return;}
        const { sfuId: sfu, producerId: producer } = location;
        return s.webrtc.sfus[sfu]?.tracks[producer];
    },
    undefined,
    ctx,
);

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