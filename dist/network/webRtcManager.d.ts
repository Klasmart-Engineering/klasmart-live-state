import { Store } from "redux";
import { State, Action } from "../ui";
import { SFU } from "./sfu";
export declare class WebRtcManager<ApplicationState = unknown> {
    readonly store: Store<ApplicationState, Action>;
    readonly selector: (s: ApplicationState) => State;
    private sfus;
    constructor(store: Store<ApplicationState, Action>, selector: (s: ApplicationState) => State);
    private connectToSFU;
    getSFU(): SFU;
}
//# sourceMappingURL=webRtcManager.d.ts.map