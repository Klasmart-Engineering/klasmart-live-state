import React, { ReactNode, useMemo } from "react";
import { SfuId } from "../network/sfu";
import { WebRtcContext, WebRtcManager } from "./rtcContext";

export interface WebRtcProviderProps {
    children?: ReactNode;
    getSfuUrl: (id: SfuId) => URL;
}

export function WebRtcProvider({
    children,
    getSfuUrl,
}: WebRtcProviderProps) {
    const value = useMemo(() => new WebRtcManager(getSfuUrl), []);
    return (
        <WebRtcContext.Provider value={value}>
            {children}
        </WebRtcContext.Provider>
    );
}
