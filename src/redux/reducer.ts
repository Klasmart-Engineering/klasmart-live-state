import { combineReducers } from "redux";
import { ClassAction, classReducer } from "./class";
import { NetworkAction, networkReducer } from "./network";
import { WebRtcAction, webrtcReducer } from "./webrtc";

export const reducer = combineReducers({
    class: classReducer,
    network: networkReducer,
    webrtc: webrtcReducer,
});

export type State = ReturnType<typeof reducer>
export type Action =
  | ClassAction
  | NetworkAction
  | WebRtcAction
