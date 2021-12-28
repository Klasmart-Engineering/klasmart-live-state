import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { ProducerID, SfuID } from "../network/sfu";
import { types as MediaSoup } from "mediasoup-client";
import { ValueOf } from "../types";

export type WebRtcState = {
    sfus: Record<SfuID, SfuState>

    videoInputs: MediaDeviceInfo[]
    audioInputs: MediaDeviceInfo[]
    audioOutputs: MediaDeviceInfo[]
}

export type SfuState = {
    consumerConnectionState?: MediaSoup.ConnectionState
    producerConnectionState?: MediaSoup.ConnectionState
    tracks: Record<ProducerID, TrackStatus>
}

export type TrackStatus = {
    localPause: boolean
    globalPause: boolean
}

export const initialState: WebRtcState = {
    sfus: {},
    videoInputs: [],
    audioInputs: [],
    audioOutputs: [],
};

const setDevices: Reducer<MediaDeviceInfo[]> = (state, { payload: devices }) => {
    const videoInputs: MediaDeviceInfo[] = [];
    const audioInputs: MediaDeviceInfo[] = [];
    const audioOutputs: MediaDeviceInfo[] = [];

    devices.forEach(d => {
        switch(d.kind) {
        case "videoinput":
            videoInputs.push(d);
            break;
        case "audioinput":
            audioInputs.push(d);
            break;
        case "audiooutput":
            audioOutputs.push(d);
            break;
        }
    });

    state.videoInputs = videoInputs;
    state.audioInputs = audioInputs;
    state.audioOutputs = audioOutputs;    
};

type Reducer<P = void, T extends string = string> = CaseReducer<WebRtcState, PayloadAction<P, T>>;

const closeTrack: Reducer<{ id: SfuID, producerId: ProducerID }> = (state, { payload: { id, producerId } }) => {
    const sfu = state.sfus[id];
    if (sfu) {
        delete sfu.tracks[producerId];
    }
};

const setTrack: Reducer<{ id: SfuID, producerId: ProducerID, status: TrackStatus }> = (state, { payload: { id, producerId, status } }) => {
    const sfu = state.sfus[id];
    if (sfu) {
        sfu.tracks[producerId] = status;
    } else {
        state.sfus[id] = {
            tracks: {
                [producerId]: status
            },
        };
    }
};

const setConsumerConnectionStatus: Reducer<{ id: SfuID, connectionState: MediaSoup.ConnectionState }> = (state, { payload: { id, connectionState } }) => {
    const sfu = state.sfus[id];
    if (sfu) {
        sfu.consumerConnectionState = connectionState;
    } else {
        state.sfus[id] = {
            consumerConnectionState: connectionState,
            tracks: {},
        };
    }
};

const setProducerConnectionStatus: Reducer<{ id: SfuID, connectionState: MediaSoup.ConnectionState }> = (state, { payload: { id, connectionState } }) => {
    const sfu = state.sfus[id];
    if (sfu) {
        sfu.producerConnectionState = connectionState;
    } else {
        state.sfus[id] = {
            producerConnectionState: connectionState,
            tracks: {},
        };
    }
};


export const webRtcSliceActionPrefix = "webrtc";
const webrtcSlice = createSlice({
    name: webRtcSliceActionPrefix,
    initialState,
    reducers: {
        closeTrack,
        setTrack,
        setConsumerConnectionStatus,
        setProducerConnectionStatus,
        setDevices,
    },
});

export const webrtcActions = webrtcSlice.actions;
export const webrtcReducer = webrtcSlice.reducer;
export type WebRtcAction = ReturnType<ValueOf<typeof webrtcSlice.actions>>;