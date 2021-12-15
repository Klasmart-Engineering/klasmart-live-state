import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { ProducerID, SfuID } from "../network/sfu";
import { types as MediaSoup } from "mediasoup-client";

export type WebRtcState = {
    sfus: Record<SfuID, SfuState>
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
    sfus: {}
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
export const webrtcSlice = createSlice({
    name: webRtcSliceActionPrefix,
    initialState,
    reducers: {
        closeTrack,
        setTrack,
        setConsumerConnectionStatus,
        setProducerConnectionStatus,
    },
});
