import React, { ReactNode, useEffect, useMemo } from "react";
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
    const value = useMemo(() => {
        return new WebRtcManager(
            endpoint,
            sessionId,
            onAuthorizationInvalid,
            onAuthorizationExpired,
            onAuthenticationInvalid,
            onAuthenticationExpired,
            onTokenMismatch,
            onMissingAuthenticationToken,
            onMissingAuthorizationToken,
        );
    }, [
        endpoint,
        sessionId,
        onAuthorizationInvalid,
        onAuthorizationExpired,
        onAuthenticationInvalid,
        onAuthenticationExpired,
        onTokenMismatch,
        onMissingAuthenticationToken,
        onMissingAuthorizationToken,
    ]);
    useEffect(() => () => { value.close(); }, [value]);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
