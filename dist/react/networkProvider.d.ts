import { ReactNode } from "react";
import { State } from "../redux/reducer";
export interface NetworkProviderProps<ApplicationState = unknown> {
    children?: ReactNode;
    selector: (state: ApplicationState) => State;
}
export declare function NetworkProvider<ApplicationState = unknown>({ children, selector, }: NetworkProviderProps<ApplicationState>): JSX.Element;
//# sourceMappingURL=networkProvider.d.ts.map