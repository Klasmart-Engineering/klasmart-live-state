import { useContext } from "react";
import { useAsync } from "react-async-hook";
import WebRtcContext from "../rtcContext";

export function useMediaStream(constraints?: MediaStreamConstraints) {
  if (!constraints) {
    constraints = {
      video: true,
      audio: true,
    };
  }
  return useAsync(navigator.mediaDevices.getUserMedia, [constraints]);
}

export function useSendMediaStream(stream: MediaStream) {
  const webRtcManager = useContext(WebRtcContext);
  const sfu = webRtcManager.getSFU();
  sfu.createTracks(stream);
}
