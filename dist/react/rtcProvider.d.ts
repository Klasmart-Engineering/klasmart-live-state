import { ReactNode } from "react";
import { SfuId } from "../network/sfu";
import { State } from "../redux/reducer";
export interface WebRtcProviderProps<ApplicationState = unknown> {
    children?: ReactNode;
    selector: (state: ApplicationState) => State;
    getSfuUrl: (id: SfuId) => URL;
}
export declare function WebRtcProvider<ApplicationState = unknown>({ children, selector, getSfuUrl, }: WebRtcProviderProps): JSX.Element;
//# sourceMappingURL=rtcProvider.d.ts.map