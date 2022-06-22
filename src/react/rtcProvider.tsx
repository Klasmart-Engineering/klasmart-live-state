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
    onTokenMismatch?: () => unknown;
    onMissingAuthenticationToken?: () => unknown;
    onMissingAuthorizationToken?: () => unknown;
}

export function WebRtcProvider({
    children,
    endpoint,
    sessionId,
    onAuthorizationInvalid,
    onAuthorizationExpired,
    onAuthenticationInvalid,
    onAuthenticationExpired,
    onTokenMismatch,
    onMissingAuthenticationToken,
    onMissingAuthorizationToken,
}: WebRtcProviderProps) {
    const value = useMemo(() => new WebRtcManager(
        endpoint,
        sessionId,
        onAuthorizationInvalid,
        onAuthorizationExpired,
        onAuthenticationInvalid,
        onAuthenticationExpired,
        onTokenMismatch,
        onMissingAuthenticationToken,
        onMissingAuthorizationToken), []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
