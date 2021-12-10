import { ReactNode } from "react";
import { State } from "../redux/reducer";
export interface WebRtcProviderProps<ApplicationState = unknown> {
    children?: ReactNode;
    selector: (state: ApplicationState) => State;
}
export declare function WebRtcProvider<ApplicationState = unknown>({ children, selector, }: WebRtcProviderProps): JSX.Element;
//# sourceMappingURL=rtcProvider.d.ts.map