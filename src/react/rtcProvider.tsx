import React, { ReactNode, useEffect, useMemo } from "react";
import { useStore } from "react-redux";
import { SfuID } from "../network/sfu";
import { Action, State } from "../redux/reducer";
import { webrtcActions } from "../redux/webrtc";
import { WebRtcContext, WebRtcManager } from "./rtcContext";
const {addEventListener, removeEventListener, enumerateDevices} = navigator.mediaDevices;

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
        const onDeviceChange = () => enumerateDevices().then(
            d => store.dispatch(webrtcActions.setDevices(d))
        );
        onDeviceChange();
        addEventListener("devicechange", onDeviceChange);
        return () => { removeEventListener("devicechange", onDeviceChange); };
    }, []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
