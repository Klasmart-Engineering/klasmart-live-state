import React, { ReactNode, useMemo } from "react";
import { WebRtcContext, WebRtcManager } from "./rtcContext";
export interface WebRtcProviderProps {
    children?: ReactNode;
    endpoint: URL;
    sessionId?: string;
    onAuthorizationInvalid?: () => unknown;
    onAuthorizationExpired?: () => unknown;
    onAuthorizationMissing?: () => unknown;
    onAuthenticationInvalid?: () => unknown;
    onAuthenticationExpired?: () => unknown;
    onAuthenticationMissing?: () => unknown;
    onTokenMismatch?: () => unknown;
}

export function WebRtcProvider({
    children,
    endpoint,
    sessionId,
    onAuthorizationInvalid,
    onAuthorizationExpired,
    onAuthenticationInvalid,
    onAuthenticationExpired,
    onAuthenticationMissing,
    onAuthorizationMissing,
    onTokenMismatch,
}: WebRtcProviderProps) {
    const value = useMemo(() => {
        const manager = new WebRtcManager(
            endpoint,
            sessionId);

        manager.on("authorizationInvalidError", () => {
            if (onAuthorizationInvalid) onAuthorizationInvalid();
        });
        manager.on("authorizationExpiredError", () => {
            if (onAuthorizationExpired) onAuthorizationExpired();
        });
        manager.on("authenticationInvalidError", () => {
            if (onAuthenticationInvalid) onAuthenticationInvalid();
        });
        manager.on("authenticationExpiredError", () => {
            if (onAuthenticationExpired) onAuthenticationExpired();
        });
        manager.on("tokenMismatchError", () => {
            if (onTokenMismatch) onTokenMismatch();
        });
        manager.on("authenticationMissingError", () => {
            if (onAuthenticationMissing) onAuthenticationMissing();
        });
        manager.on("authorizationMissingError", () => {
            if (onAuthorizationMissing) onAuthorizationMissing();
        });

        return manager;
    }, []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
