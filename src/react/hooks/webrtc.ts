import { useContext, useEffect, useMemo } from "react";
import { useAsyncCallback } from "react-async-hook";
import { useSelector } from "react-redux";
import { SfuID, ProducerID } from "../../network/sfu";
import { State } from "../../redux/reducer";
import { WebRtcContext } from "../rtcContext";

export function useCamera() {
    return useAsyncCallback<MediaStream>(async (
        constraints: MediaStreamConstraints = {
            video: true,
            audio: true,
        },
    ) => {
        if(!navigator?.mediaDevices?.getUserMedia) { throw new Error('Could not get user media'); }
        return await navigator.mediaDevices.getUserMedia(constraints);
    });
}

export function useWebRtcState<T = unknown>(
    selector: (state: State) => T,
    equalityCheck?: (left: T, right: T) => boolean
) {
    const webrtc = useContext(WebRtcContext)
    return useSelector(
      (state) => selector(webrtc.selector(state)),
      equalityCheck
    );
}

export function useMediaStream(sfuId: SfuID, ids: ProducerID[]) {
    //This will trigger rerenders
    useWebRtcState(s => ids.map(id => s.webrtc.sfus[sfuId]?.tracks[id]))
    
    const webrtc = useContext(WebRtcContext);
    const mediaStream = useMemo(() => new MediaStream(), [])

    useEffect(() => {
        const tracks = webrtc.getTracks(sfuId, ids)
        tracks.forEach(t => t.then(track => {
                if(mediaStream.getTrackById(track.id)) { return }
                mediaStream.addTrack(track)
            },
        ))
        //TODO: Check whether we need to remove old tracks
    }, [ids, sfuId, mediaStream])

    return mediaStream
}

export function useSendMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback(async (sfuId: SfuID, mediaStream: MediaStream) => {
        const tracks = mediaStream.getTracks()
        const promises = webrtc.sendTracks(sfuId, tracks)
        if(!promises) { return []}
        const producers = await Promise.allSettled(promises)
        return producers.reduce((ids: ProducerID[],result) => {
            if(result.status !== "fulfilled") { return ids }
            return [...ids, result.value.id as ProducerID]
        },
        [])
    })
}

export function useLocallyPauseMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback((sfuId: SfuID, producerId: ProducerID) => webrtc.localPause(sfuId, producerId, false));
}

export function useLocallyResumeMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback((sfuId: SfuID, producerId: ProducerID) => webrtc.localPause(sfuId, producerId, true));
}

export function useGloballyPauseMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback((sfuId: SfuID, producerId: ProducerID) => webrtc.globalPause(sfuId, producerId, true));
}

export function useGloballyResumeMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback((sfuId: SfuID, producerId: ProducerID) => webrtc.globalPause(sfuId, producerId, false));
}