import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { ProducerId, SfuId } from "../network/sfu";
import { types as MediaSoup } from "mediasoup-client";
import { ValueOf } from "../types";
export declare type WebRtcState = {
    sfus: Record<SfuId, SfuState>;
    videoInputs: MediaDeviceInfo[];
    audioInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
};
export declare type SfuState = {
    consumerConnectionState?: MediaSoup.ConnectionState;
    producerConnectionState?: MediaSoup.ConnectionState;
    tracks: Record<ProducerId, TrackStatus>;
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
        id: SfuId;
        producerId: ProducerId;
    }, string>;
    setTrack: Reducer<{
        id: SfuId;
        producerId: ProducerId;
        status: TrackStatus;
    }, string>;
    setConsumerConnectionStatus: Reducer<{
        id: SfuId;
        connectionState: MediaSoup.ConnectionState;
    }, string>;
    setProducerConnectionStatus: Reducer<{
        id: SfuId;
        connectionState: MediaSoup.ConnectionState;
    }, string>;
    setDevices: Reducer<MediaDeviceInfo[], string>;
}, "webrtc">;
export declare const webrtcActions: import("@reduxjs/toolkit").CaseReducerActions<{
    closeTrack: Reducer<{
        id: SfuId;
        producerId: ProducerId;
    }, string>;
    setTrack: Reducer<{
        id: SfuId;
        producerId: ProducerId;
        status: TrackStatus;
    }, string>;
    setConsumerConnectionStatus: Reducer<{
        id: SfuId;
        connectionState: MediaSoup.ConnectionState;
    }, string>;
    setProducerConnectionStatus: Reducer<{
        id: SfuId;
        connectionState: MediaSoup.ConnectionState;
    }, string>;
    setDevices: Reducer<MediaDeviceInfo[], string>;
}>;
export declare const webrtcReducer: import("redux").Reducer<WebRtcState, import("redux").AnyAction>;
export declare type WebRtcAction = ReturnType<ValueOf<typeof webrtcSlice.actions>>;
export {};
//# sourceMappingURL=webrtc.d.ts.map