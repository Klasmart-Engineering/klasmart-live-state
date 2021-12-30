import React, { ReactNode, useEffect, useMemo } from "react";
import { useStore } from "react-redux";
import { SfuID } from "../network/sfu";
import { Action, State } from "../redux/reducer";
import { webrtcActions } from "../redux/webrtc";
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
    useEffect(() => {
        const onDeviceChange = () => navigator.mediaDevices.enumerateDevices().then(
            d => store.dispatch(webrtcActions.setDevices(d))
        );
        onDeviceChange();
        navigator.mediaDevices.addEventListener("devicechange", onDeviceChange);
        return () => { navigator.mediaDevices.removeEventListener("devicechange", onDeviceChange); };
    }, []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
