import { ReactNode } from "react";
import { SfuId } from "../network/sfu";
export interface WebRtcProviderProps {
    children?: ReactNode;
    getSfuUrl: (id: SfuId) => URL;
}
export declare function WebRtcProvider({ children, getSfuUrl, }: WebRtcProviderProps): JSX.Element;
//# sourceMappingURL=rtcProvider.d.ts.map