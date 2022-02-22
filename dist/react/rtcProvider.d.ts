import { ReactNode } from "react";
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
export declare function WebRtcProvider({ children, endpoint, sessionId, onAuthorizationInvalid, onAuthorizationExpired, onAuthenticationInvalid, onAuthenticationExpired, onTokenMismatch, onMissingAuthenticationToken, onMissingAuthorizationToken, }: WebRtcProviderProps): JSX.Element;
//# sourceMappingURL=rtcProvider.d.ts.map