import { ReactNode } from "react";
export interface WebRtcProviderProps {
    children?: ReactNode;
    endpoint: URL;
    sessionId?: string;
    onAuthorizationInvalid?: () => unknown;
    onAuthorizationExpired?: () => unknown;
}
export declare function WebRtcProvider({ children, endpoint, sessionId, onAuthorizationInvalid, onAuthorizationExpired, }: WebRtcProviderProps): JSX.Element;
//# sourceMappingURL=rtcProvider.d.ts.map