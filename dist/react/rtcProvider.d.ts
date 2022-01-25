import { ReactNode } from "react";
export interface WebRtcProviderProps {
    children?: ReactNode;
    endpoint: URL;
    sessionId?: string;
}
export declare function WebRtcProvider({ children, endpoint, sessionId, }: WebRtcProviderProps): JSX.Element;
//# sourceMappingURL=rtcProvider.d.ts.map