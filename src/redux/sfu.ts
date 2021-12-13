import { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { CaseReducer } from "@reduxjs/toolkit/dist/createReducer";
import { createSlice } from "@reduxjs/toolkit/dist/createSlice";
import { ProducerId } from "../network/sfu";
import { types as MediaSoup } from "mediasoup-client"

export type WebRtcState = {
    sfus: Record<string, SfuState>
}

export type SfuState = {
    consumerConnectionState?: MediaSoup.ConnectionState
    producerConnectionState?: MediaSoup.ConnectionState
    tracks: Record<ProducerId, TrackStatus>
}

export type TrackStatus = {
    localPause: boolean
    globalPause: boolean
}

export const initialState: WebRtcState = {
    sfus: {}
}

type Reducer<P = void, T extends string = string> = CaseReducer<WebRtcState, PayloadAction<P, T>>;

const closeTrack: Reducer<{ url: string, producerId: ProducerId }> = (state, { payload: { url, producerId } }) => {
    const sfu = state.sfus[url]
    if (sfu) {
        delete sfu.tracks[producerId]
    }
};

const setTrack: Reducer<{ url: string, producerId: ProducerId, status: TrackStatus }> = (state, { payload: { url, producerId, status } }) => {
    const sfu = state.sfus[url]
    if (sfu) {
        sfu.tracks[producerId] = status
    } else {
        state.sfus[url] = {
            tracks: {
                [producerId]: status
            },
        }
    }
};


const setConsumerConnectionStatus: Reducer<{ url: string, connectionState: MediaSoup.ConnectionState }> = (state, { payload: { url, connectionState } }) => {
    const sfu = state.sfus[url]
    if (sfu) {
        sfu.consumerConnectionState = connectionState
    } else {
        state.sfus[url] = {
            consumerConnectionState: connectionState,
            tracks: {},
        }
    }
};

const setProducerConnectionStatus: Reducer<{ url: string, connectionState: MediaSoup.ConnectionState }> = (state, { payload: { url, connectionState } }) => {
    const sfu = state.sfus[url]
    if (sfu) {
        sfu.producerConnectionState = connectionState
    } else {
        state.sfus[url] = {
            producerConnectionState: connectionState,
            tracks: {},
        }
    }
};


export const webRtcSliceActionPrefix = "webrtc"
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
