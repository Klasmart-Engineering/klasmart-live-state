import { useContext } from "react";
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
        if(!navigator?.mediaDevices?.getUserMedia) { throw new Error("Could not get user media"); }
        return await navigator.mediaDevices.getUserMedia(constraints);
    });
}

export function useWebRtcState<T = unknown>(
    selector: (state: State) => T,
    equalityCheck?: (left: T, right: T) => boolean
) {
    const webrtc = useContext(WebRtcContext);
    return useSelector(
        (state) => selector(webrtc.selector(state)),
        equalityCheck
    );
}


export function useSendMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback(async (sfuId: SfuID, mediaStream: MediaStream) => {
        const tracks = mediaStream.getTracks();
        const promises = webrtc.sendTracks(sfuId, tracks);
        if(!promises) { return [];}
        const producers = await Promise.allSettled(promises);
        return producers.reduce((ids: ProducerID[],result) => {
            if(result.status !== "fulfilled") { return ids; }
            return [...ids, result.value.id as ProducerID];
        },
        []);
    });
}

export function useMediaTrackIsPaused(sfuId: SfuID, producerId: ProducerID) {
    return useWebRtcState(s => {
        const sfu = s.webrtc.sfus[sfuId];
        if(!sfu) {return;} 
        const track = sfu.tracks[producerId];
        if(!track) {return;}
        return track.globalPause || track.localPause;
    });
}

export function useLocallyPauseMediaTrack() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback((sfuId: SfuID, producerId: ProducerID, pause: boolean) => webrtc.localPause(sfuId, producerId, pause));
}

export function useGloballyPauseMediaStream() {
    const webrtc = useContext(WebRtcContext);
    return useAsyncCallback((sfuId: SfuID, producerId: ProducerID, pause: boolean) => webrtc.globalPause(sfuId, producerId, pause));
}
