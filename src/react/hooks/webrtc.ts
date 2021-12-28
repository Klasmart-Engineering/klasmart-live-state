import { useContext, useMemo } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { useSelector } from "react-redux";
import { newSfuID, ProducerID } from "../../network/sfu";
import { State } from "../../redux/reducer";
import { StreamSender, TrackLocation, TrackSender, WebRtcContext } from "../rtcContext";

export const useCamera = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.camera, ctx);
export const useMicrophone = (ctx = useContext(WebRtcContext)) => useTrackSender(ctx.microphone, ctx);
export const useScreenshare = (ctx = useContext(WebRtcContext)) => useStreamSender(ctx.screenshare, ctx);

export const useStream = (
    ids: ProducerID[],
    ctx = useContext(WebRtcContext),
) => {
    const stream = useMemo(() => {
        const stream = new MediaStream();
        ids.map(producer => ctx
            .getTrack({producerId: producer,sfuId: newSfuID("test-sfu")})
            .then(t => stream.addTrack(t)),
        );
        return stream;
    }, ids);
    return stream;
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
});

const useTrackSender = (
    trackSender: TrackSender,
    ctx = useContext(WebRtcContext),
) => ({
    start: useAsyncCallback(() => trackSender.start()),
    stop: useAsyncCallback(() => trackSender.stop()),
    paused: useTrackPauseState(trackSender.location, ctx),
});

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