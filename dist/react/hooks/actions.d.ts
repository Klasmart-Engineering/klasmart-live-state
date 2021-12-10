import { ActivityStreamID, Content, DeviceID, TrophyType, UserID } from "../../models";
import { ProducerId } from "../../network/sfu";
export declare function useJoinClass(): {
    joinClass: (url: string) => Promise<boolean>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useLeaveClass(): {
    leaveClass: (reason?: string | undefined) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useEndClass(): {
    endClass: () => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useRewardTrophyToAll(): {
    rewardTrophyToAll: (trophyType: TrophyType) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useRewardTrophyToUser(): {
    rewardTrophyToUser: (trophyType: TrophyType, toUserId: UserID) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useSendChatMessage(): {
    sendChatMessage: (text: string) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useSetActivityStreamId(): {
    setActivityStreamId: (activityStreamId?: ActivityStreamID | undefined) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useSetContent(): {
    setContent: (content: Content) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useSetHost(): {
    setHost: (hostDeviceId: DeviceID) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useLocallyPauseMediaStream(): {
    locallyPause: (id: ProducerId) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useLocallyPlayMediaStream(): {
    locallyPlay: (id: ProducerId) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useGloballyPauseMediaStream(): {
    globallyPause: (id: ProducerId) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useGloballyPlayMediaStream(): {
    globallyPlay: (id: ProducerId) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
//# sourceMappingURL=actions.d.ts.map