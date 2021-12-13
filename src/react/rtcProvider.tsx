import React, { ReactNode, useMemo } from "react";
import { useStore } from "react-redux";
import { Action, State } from "../redux/reducer";
import { WebRtcContext, WebRtcManager } from "./rtcContext";

export interface WebRtcProviderProps<ApplicationState = unknown> {
  children?: ReactNode;
  selector: (state: ApplicationState) => State;
}

export function WebRtcProvider<ApplicationState = unknown>({
  children,
  selector,
}: WebRtcProviderProps) {
  const store = useStore<ApplicationState, Action>();
  const value = useMemo(() => new WebRtcManager(store, selector), [
    store,
    selector,
  ]);
  return (
    <WebRtcContext.Provider value={value as WebRtcManager<unknown>}>
      {children}
    </WebRtcContext.Provider>
  );
}
