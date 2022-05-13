import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { TrackInfo, TrackLocation } from "../../network/room";
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
  audioState: SfuTrackState | undefined,
  videoState: SfuTrackState | undefined,
}

export type SfuTrackState = {
  isConsumable: boolean,
  isPausedLocally: boolean,
  isPausedGlobally: boolean,
  isPausedAtSource: boolean,
}

//
// -> get all the fucking streams
// -> for every stream, setup the on/off events 
// -> for every stream/track get the state and return that shite
//
// export const useTracksInfoStreams = (ctx = useContext(WebRtcContext)) => {
//   const [renderCount, rerender] = useReducer(i => i + 1, 0);
//   const trackInfos = ctx.room.getAllTracks();

//   useEffect(() => {
//     ctx.room.on("tracksUpdated", rerender);
//     return () => { ctx.room.off("tracksUpdated", rerender);};
//   }, [ctx.room]);
// }

export const useRoomTracks = (ctx = useContext(WebRtcContext)) => {
  const trackInfos = ctx.room.tracks();
  const audioName = "microphone";
  const videoName = "camera";
  const [loading, setLoading] = useState(false);
  const [renderCount, rerender] = useReducer(i => i + 1, 0);

  const sessionToTracksMap = useMemo(() => {
    const sessionToTracksMap: Map<string, SessionAVStreams> = new Map();
    console.warn('0. useMemo ===>', { trackInfos })
  
    trackInfos.forEach((trackInfo) => {
      const sessionId = trackInfo.sessionId;
      if (sessionId) {
        const name = trackInfo.name;
        const sessionTracks = sessionToTracksMap.get(sessionId);
        console.warn('1. useMemo ===>', { sessionId, sessionTracks, sessionToTracksMap })
        if (!sessionTracks) {
          const newAvTracks = {
            sessionId,
            audioLocation: name === audioName ? trackInfo : undefined,
            videoLocation: name === videoName ? trackInfo : undefined,
          } as SessionAVStreams;
          sessionToTracksMap.set(sessionId, newAvTracks);
          console.warn('2. useMemo ===>', { sessionId, newAvTracks, sessionToTracksMap })
        } else {
          if (name === audioName) {
            sessionTracks.audioLocation = trackInfo;
          } else if (name === videoName) {
            sessionTracks.videoLocation = trackInfo;
          }
          console.warn('3. useMemo ===>', { sessionId, sessionTracks, sessionToTracksMap })
        }
      }
    });
    console.warn('x. useMemo ===>', { sessionToTracksMap })
    return sessionToTracksMap
  }, [trackInfos])

  console.warn('useRoomTracks ===>', { trackInfos, sessionToTracksMap })

  const [sessionsTracks, setSessionsTracks] = useState(Array.from(sessionToTracksMap.values()))

  // // get the SFU tracks
  // const { sfuId, producerId } = trackInfo;
  // const sfuTrack = await ctx.sfu(sfuId).getTrack(producerId);
  useEffect(() => {
    const f = async () => {
      console.warn('1. useEffect FUNC ===> subscribe to', sessionsTracks.length, 'tracks')
      setLoading(true);

      const newSessionsTracks = (await Promise.all(sessionsTracks.map(async (sessionTracks) => {
        const { sessionId, audioLocation, videoLocation } = sessionTracks;
        let audio
        let video
        let audioState
        let videoState

        for (const { location, type } of [{ location: audioLocation, type: 'audio' }, { location: videoLocation, type: 'video' }]) {
          let sfuTrack: SfuTrack | undefined = undefined
          let state: SfuTrackState | undefined = undefined

          console.warn('2. useEffect FUNC loop ===>', { location, type })

          if (location) {
            // get the SFU track
            const { sfuId, producerId } = location;
            try {
              sfuTrack = await ctx.sfu(sfuId).getTrack(producerId);
              console.log('+++++++++++++>>>>>sfuTrack =>', sfuTrack)
            } catch (e) {
              console.error('Failed to get the SFU track =>', e)
            }

            // update the state
            const isActiveLocally = sfuTrack?.pausedLocally === false;
            const isActiveAtProducer = sfuTrack?.pausedAtSource === false;
            const isActiveGlobally = isActiveAtProducer && sfuTrack?.pausedGlobally === false;

            state = sfuTrack ? {
              isConsumable: isActiveGlobally && isActiveLocally,
              isPausedLocally: sfuTrack.pausedLocally !== false,
              isPausedGlobally: sfuTrack.pausedGlobally !== false,
              isPausedAtSource: sfuTrack.pausedAtSource !== false,
            } : {
              isConsumable: false,
              isPausedLocally: false,
              isPausedGlobally: false,
              isPausedAtSource: false,
            }
          }

          if (type === 'audio') {
            audio = sfuTrack
            audioState = state
          } else {
            video = sfuTrack
            videoState = state
          }
        }

        return {
          sessionId,
          audioLocation,
          videoLocation,
          audio,
          audioState,
          video,
          videoState,
        }
      })))

      console.warn('3. useEffect setting newSessionsTracks ===>', { newSessionsTracks })
      setSessionsTracks(newSessionsTracks)
      setLoading(false)
    }

    // async call
    f()

    return () => {
      console.warn('END. useEffect ===> unsubscribe to', sessionsTracks.length, 'tracks')
    }
  }, [renderCount])

  useEffect(() => {
    ctx.room.on("tracksUpdated", rerender);
    console.warn(' --------------- TRACKS UPDATED EVENT ----------------')
    return () => { ctx.room.off("tracksUpdated", rerender);};
  }, [ctx.room]);

  console.warn('xyz 1. useRoomTracks RETURNS ===>', { sessionToTracksMap, sessionsTracks })

  return { sessionsTracks, loading }
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
