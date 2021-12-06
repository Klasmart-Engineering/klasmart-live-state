import React, { FC, useMemo } from "react";
import { useStore } from "react-redux";
import { Action, State } from "../redux/reducer";
import WebRtcContext, { WebRtcManager } from "./rtcContext";

  
export const WebRtcProvider: FC<{
  selector: (state: unknown) => State;
}> = ({
    children,
    selector,
}) => {
    const store = useStore<unknown,Action>();
    const value = useMemo(() => new WebRtcManager(store, selector), [store, selector]);
    return <WebRtcContext.Provider value={value}>
        {children}
    </WebRtcContext.Provider>;
  };
  