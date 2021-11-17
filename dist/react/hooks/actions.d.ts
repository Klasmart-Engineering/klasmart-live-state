import { ActivityStreamID, Content, DeviceID, TrophyType, UserID } from "../../models";
export declare function useJoinClass(): {
    joinClass: (url: string) => Promise<WebSocket>;
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
    rewardTrophyToAll: (type: TrophyType) => Promise<void>;
    status: import("react-async-hook").AsyncStateStatus;
};
export declare function useRewardTrophyToUser(): {
    rewardTrophyToUser: (userId: UserID, type: TrophyType) => Promise<void>;
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
//# sourceMappingURL=actions.d.ts.map