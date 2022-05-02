import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackInfo, TrackLocation } from "../../network/room";
import { Track as SfuTrack } from "../../network/track";
import { TrackSender } from "../../network/trackSender";
import { WebRtcContext, WebRtcManager } from "../rtcContext";

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

export type SessionAVTracksInfo = {
  sessionId: string,
  audioLocation: TrackInfo | undefined;
  videoLocation: TrackInfo | undefined;
};

export type SessionAVStreams = {
  sessionId: string,
  audioLocation: TrackInfo | undefined;
  videoLocation: TrackInfo | undefined;
  audio: SfuTrack | undefined,
  video: SfuTrack | undefined,
}

//
// -> get all the fucking streams
// -> for every stream, setup the on/off events 
// -> for every stream/track get the state and return that shite
//
export const useRoomTracks = (ctx = useContext(WebRtcContext)) => {
  const trackInfos = ctx.room.tracks();
  const audioName = "microphone";
  const videoName = "camera";
  const [loading, setLoading] = useState(false);

  const [renderCount, rerender] = useReducer(i => i + 1, 0);
  const sessionToTracksMap = useMemo(() => {
    const sessionToTracksMap: Map<string, SessionAVStreams> = new Map();
  
    trackInfos.forEach((trackInfo) => {
      const sessionId = trackInfo.sessionId;
      if (sessionId) {
        const name = trackInfo.name;
        sessionToTracksMap.get(sessionId);
        const sessionTracks = sessionToTracksMap.get(sessionId) || { sessionId } as SessionAVStreams;

        if (!sessionTracks) {
          const newAvTracks = {
          sessionId,
            audioLocation: name === audioName ? trackInfo : undefined,
            videoLocation: name === videoName ? trackInfo : undefined,
          } as SessionAVStreams;
          sessionToTracksMap.set(sessionId, newAvTracks);
        } else {
          if (name === audioName) {
            sessionTracks.audioLocation = trackInfo;
          } else if (name === videoName) {
            sessionTracks.videoLocation = trackInfo;
          }
        }
      }
    });

    return sessionToTracksMap
  }, [ctx, trackInfos, renderCount])

  // // get the SFU tracks
  // const { sfuId, producerId } = trackInfo;
  // const sfuTrack = await ctx.sfu(sfuId).getTrack(producerId);
  useEffect(() => {
    const f = async () => {
      setLoading(true)
      for (const audioVideoTracks of sessionToTracksMap.values()) {
        const { sessionId, audioLocation, videoLocation } = audioVideoTracks
        if (audioLocation) {
          const { sfuId, producerId } = audioLocation;
          const sfuTrack = await ctx.sfu(sfuId).getTrack(producerId);
          sfuTrack.on("pausedAtSource", rerender);
          sfuTrack.on("pausedGlobally", rerender);
          sfuTrack.on("pausedLocally", rerender);
          sessionToTracksMap.set(sessionId, {...audioVideoTracks, audio: sfuTrack })
        }
        if (videoLocation) {
          const { sfuId, producerId } = videoLocation;
          const sfuTrack = await ctx.sfu(sfuId).getTrack(producerId);
          sfuTrack.on("pausedAtSource", rerender);
          sfuTrack.on("pausedGlobally", rerender);
          sfuTrack.on("pausedLocally", rerender);
          sessionToTracksMap.set(sessionId, {...audioVideoTracks, video: sfuTrack })
        }
      }
      setLoading(false)
    }

    // async call
    f()

    return () => {
      for (const audioVideoTracks of sessionToTracksMap.values()) {
        const { audio, video } = audioVideoTracks
        if (audio) {
          audio.off("pausedAtSource", rerender);
          audio.off("pausedGlobally", rerender);
          audio.off("pausedLocally", rerender);
        }
        if (video) {
          video.off("pausedAtSource", rerender);
          video.off("pausedGlobally", rerender);
          video.off("pausedLocally", rerender);
        }
      }
    }
  })

  useEffect(() => {
    ctx.room.on("tracksUpdated", rerender);
    return () => { ctx.room.off("tracksUpdated", rerender);};
  }, [ctx.room]);

  return { sessionToTracksMap, loading}
};

/// TODO
export const useTracksStates = () => {}

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

// const useTracks = async (locations: TrackLocation[], ctx = useContext(WebRtcContext)) => {

//   const _getTrack = async (location: TrackLocation) => {
//     const { sfuId, producerId } = location;
//     return await ctx.sfu(sfuId).getTrack(producerId)
//   }

//   const {
//     currentPromise: tracksPromise,
//     result: tracks,
//     execute: execGetTracks,
//   } = useAsync(async (locations: TrackLocation[]) => {
//     if (locations.length === 0) { return; }
//     return Promise.all(locations.map(async (location) => {
//       const { sfuId, producerId } = location;
//       return ctx.sfu(sfuId).getTrack(producerId); // returns memoized track or creates a new one
//     }));
//   }, [locations])

//   useEffect(() => {
//     if (locations.length === 0) { return; }
    
//     // each individual track update will trigger the execution of an update to the list of tracks
//     const exitFuncs = locations.map((location) => {
//       const {sfuId, producerId} = location;
//       const sfu = ctx.sfu(sfuId);
//       const callback = () => execGetTracks(locations);
//       sfu.onTrackUpdate(producerId, callback);
//       return () => void sfu.offTrackUpdate(producerId, callback);
//     })

//     return () => {
//       exitFuncs.forEach((f) => void f())
//     }
//   })
  
//   // const trackPromise = _getTrack()
//   const start = async () => (await trackPromise)?.start();
//   const stop = async () => (await trackPromise)?.stop();

//   return {
//     track,
//     hasLocation: Boolean(location),
//     ...useTrackState(track),
//     kind: track?.kind,
//     isMine: track?.isMine,
//     start,
//     stop,
//     pause: useAsyncCallback(async (paused: boolean) => await (paused ? stop : start).execute()),
//     globalPause: useAsyncCallback(async (paused: boolean) => (await trackPromise)?.requestBroadcastStateChange(paused)),
//   }
// }


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
        isPausedLocally: false,
        isPausedGlobally: false,
        isPausedAtSource: false
    };

    return {
        isConsumable: isActiveGlobally && isActiveLocally,
        isPausedLocally: track.pausedLocally !== false,
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
