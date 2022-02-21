import React, { ReactNode, useMemo } from "react";
import { WebRtcContext, WebRtcManager } from "./rtcContext";
export interface WebRtcProviderProps {
    children?: ReactNode;
    endpoint: URL;
    sessionId?: string;
    onAuthorizationInvalid?: () => unknown;
    onAuthorizationExpired?: () => unknown;
    onAuthenticationInvalid?: () => unknown;
    onAuthenticationExpired?: () => unknown;
}

export function WebRtcProvider({
    children,
    endpoint,
    sessionId,
    onAuthorizationInvalid,
    onAuthorizationExpired,
    onAuthenticationInvalid,
    onAuthenticationExpired,
}: WebRtcProviderProps) {
    const value = useMemo(() => new WebRtcManager(endpoint, sessionId, onAuthorizationInvalid, onAuthorizationExpired, onAuthenticationInvalid, onAuthenticationExpired), []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
