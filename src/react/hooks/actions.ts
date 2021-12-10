import { useContext } from "react";
import { useAsyncCallback } from "react-async-hook";
import {
  ActivityStreamID,
  Content,
  DeviceID,
  TrophyType,
  UserID,
} from "../../models";
import { ProducerId, Request } from "../../network/sfu";
import { IClassRequest } from "../../protobuf";
import NetworkContext from "../networkContext";
import WebRtcContext from "../rtcContext";

export function useJoinClass() {
  const network = useContext(NetworkContext);
  const initWs = (url: string) => network.connect(url);
  const { execute: joinClass, status } = useAsyncCallback(initWs, {
    onError: (e) => console.error(e),
  });
  return { joinClass, status };
}

export function useLeaveClass() {
  const network = useContext(NetworkContext);
  const close = (reason?: string) => network.disconnect(4200, reason);
  const { execute: leaveClass, status } = useAsyncCallback(close);
  return { leaveClass, status };
}

export function useEndClass() {
  const { execute, status } = useNetworkAction(() => ({ endClass: {} }));
  return { endClass: execute, status };
}

export function useRewardTrophyToAll() {
  const { execute, status } = useNetworkAction((trophyType: TrophyType) => ({
    rewardTrophyToAll: {
      trophyType,
    },
  }));
  return { rewardTrophyToAll: execute, status };
}

export function useRewardTrophyToUser() {
  const { execute, status } = useNetworkAction(
    (trophyType: TrophyType, toUserId: UserID) => ({
      rewardTrophyToUser: {
        trophyType,
        toUserId,
      },
    })
  );
  return { rewardTrophyToUser: execute, status };
}

export function useSendChatMessage() {
  const { execute, status } = useNetworkAction((text: string) => ({
    sendChatMessage: {
      text,
    },
  }));
  return { sendChatMessage: execute, status };
}

export function useSetActivityStreamId() {
  const { execute, status } = useNetworkAction(
    (activityStreamId?: ActivityStreamID) => ({
      setActivityStreamId: {
        activityStreamId,
      },
    })
  );
  return { setActivityStreamId: execute, status };
}

export function useSetContent() {
  const { execute, status } = useNetworkAction((content: Content) => ({
    setContent: {
      content,
    },
  }));
  return { setContent: execute, status };
}

export function useSetHost() {
  const { execute, status } = useNetworkAction((hostDeviceId: DeviceID) => ({
    setHost: { hostDeviceId },
  }));
  return { setHost: execute, status };
}

function useNetworkAction<Args extends any[] = any[]>(
  buildRequest: (...args: Args) => IClassRequest
) {
  const network = useContext(NetworkContext);
  const sendRequest = async (...args: Args) => {
    const request = buildRequest(...args);
    await network.send(request);
  };
  return useAsyncCallback(sendRequest);
}

export function useLocallyPauseMediaStream() {
  const { execute, status } = useProducerAction((id: ProducerId) => ({
    locallyPause: {
      paused: true,
      id,
    },
  }));
  return { locallyPause: execute, status };
}

export function useLocallyPlayMediaStream() {
  const { execute, status } = useProducerAction((id: ProducerId) => ({
    locallyPause: {
      paused: false,
      id,
    },
  }));
  return { locallyPlay: execute, status };
}

export function useGloballyPauseMediaStream() {
  const { execute, status } = useProducerAction((id: ProducerId) => ({
    globallyPause: {
      paused: true,
      id,
    },
  }));
  return { globallyPause: execute, status };
}

export function useGloballyPlayMediaStream() {
  const { execute, status } = useProducerAction((id: ProducerId) => ({
    globallyPause: {
      paused: false,
      id,
    },
  }));
  return { globallyPlay: execute, status };
}

function useProducerAction<Args extends any[] = any[]>(
  buildRequest: (...args: Args) => Request
) {
  const webRtcManager = useContext(WebRtcContext);
  const sfu = webRtcManager.getSFU();
  const sendRequest = async (...args: Args) => {
    const request = buildRequest(...args);
    await sfu.request(request);
  };
  return useAsyncCallback(sendRequest);
}
