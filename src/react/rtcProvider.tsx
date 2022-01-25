import React, { ReactNode, useMemo } from "react";
import { WebRtcContext, WebRtcManager } from "./rtcContext";

export interface WebRtcProviderProps {
    children?: ReactNode;
    endpoint: URL;
    sessionId?: string;
}

export function WebRtcProvider({
    children,
    endpoint,
    sessionId,
}: WebRtcProviderProps) {
    const value = useMemo(() => new WebRtcManager(endpoint, sessionId), []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
