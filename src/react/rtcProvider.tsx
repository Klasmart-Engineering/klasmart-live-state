import React, { ReactNode, useMemo } from "react";
import { useStore } from "react-redux";
import { SfuID } from "../network/sfu";
import { Action, State } from "../redux/reducer";
import { WebRtcContext, WebRtcManager } from "./rtcContext";

export interface WebRtcProviderProps<ApplicationState = unknown> {
  children?: ReactNode;
  selector: (state: ApplicationState) => State;
  getSfuUrl: (id: SfuID) => URL;
}

export function WebRtcProvider<ApplicationState = unknown>({
  children,
  selector,
  getSfuUrl,
}: WebRtcProviderProps) {
  const store = useStore<ApplicationState, Action>();
  const value = useMemo(() => new WebRtcManager(store, selector, getSfuUrl), []);
  return (
    <WebRtcContext.Provider value={value as WebRtcManager<unknown>}>
      {children}
    </WebRtcContext.Provider>
  );
}
