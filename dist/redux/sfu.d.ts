import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { ProducerID, SfuID } from "../network/sfu";
import { types as MediaSoup } from "mediasoup-client";
export declare type WebRtcState = {
    sfus: Record<SfuID, SfuState>;
};
export declare type SfuState = {
    consumerConnectionState?: MediaSoup.ConnectionState;
    producerConnectionState?: MediaSoup.ConnectionState;
    tracks: Record<ProducerID, TrackStatus>;
};
export declare type TrackStatus = {
    localPause: boolean;
    globalPause: boolean;
};
export declare const initialState: WebRtcState;
declare type Reducer<P = void, T extends string = string> = CaseReducer<WebRtcState, PayloadAction<P, T>>;
export declare const webRtcSliceActionPrefix = "webrtc";
export declare const webrtcSlice: import("@reduxjs/toolkit").Slice<WebRtcState, {
    closeTrack: Reducer<{
        id: SfuID;
        producerId: ProducerID;
    }, string>;
    setTrack: Reducer<{
        id: SfuID;
        producerId: ProducerID;
        status: TrackStatus;
    }, string>;
    setConsumerConnectionStatus: Reducer<{
        id: SfuID;
        connectionState: MediaSoup.ConnectionState;
    }, string>;
    setProducerConnectionStatus: Reducer<{
        id: SfuID;
        connectionState: MediaSoup.ConnectionState;
    }, string>;
}, "webrtc">;
export {};
//# sourceMappingURL=sfu.d.ts.map