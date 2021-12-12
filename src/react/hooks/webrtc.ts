import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { WebRtcContext } from "../rtcContext";

export function useStream(url: string, trackId: string) {
    const webrtc = useContext(WebRtcContext)
    return webrtc.track(url, trackId);
}

export function useSendStream(url: string, mediaStream: MediaStream) {
    const webrtc = useContext(WebRtcContext);
    const tracks = mediaStream.getTracks();
    useMemo(() => {
        tracks.map(t => webrtc.sendTrack())

    }, tracks)
    return webrtc.track(url, trackId);
}