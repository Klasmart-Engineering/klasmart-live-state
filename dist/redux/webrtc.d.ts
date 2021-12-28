import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { ProducerID, SfuID } from "../network/sfu";
import { types as MediaSoup } from "mediasoup-client";
import { ValueOf } from "../types";
export declare type WebRtcState = {
    sfus: Record<SfuID, SfuState>;
    videoInputs: MediaDeviceInfo[];
    audioInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
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
declare const webrtcSlice: import("@reduxjs/toolkit").Slice<WebRtcState, {
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
    setDevices: Reducer<MediaDeviceInfo[], string>;
}, "webrtc">;
export declare const webrtcActions: import("@reduxjs/toolkit").CaseReducerActions<{
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
    setDevices: Reducer<MediaDeviceInfo[], string>;
}>;
export declare const webrtcReducer: import("redux").Reducer<WebRtcState, import("redux").AnyAction>;
export declare type WebRtcAction = ReturnType<ValueOf<typeof webrtcSlice.actions>>;
export {};
//# sourceMappingURL=webrtc.d.ts.map