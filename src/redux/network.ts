import { createAction, createReducer } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { DeviceID } from "../models";
import { NetworkTransportState } from "../network/networkTransport";
import { ValueOf } from "../types";
import { classActions } from "./class";

export const setConnectionState = createAction<NetworkTransportState>(
    "setConnectionState"
);
export const connectionStatus = createReducer<NetworkTransportState>(
    "not-connected",
    (builder) => builder.addCase(setConnectionState, (_, { payload }) => payload)
);

export const myDeviceId = createReducer<DeviceID | null>(null, (builder) =>
    builder.addCase(classActions.join, (_, { payload }) => payload.deviceId)
);

export const networkReducer = combineReducers({
    connectionStatus,
    myDeviceId,
});

const networkActions = {
    setConnectionState,
};

export type NetworkAction = ReturnType<ValueOf<typeof networkActions>>;
