import { DeviceID } from '../models';
import { ValueOf } from '../types';
export declare const setConnectionState: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
export declare const connectionStatus: import("redux").Reducer<any, import("redux").AnyAction>;
export declare const myDeviceId: import("redux").Reducer<DeviceID | null, import("redux").AnyAction>;
export declare const networkReducer: import("redux").Reducer<import("redux").CombinedState<{
    connectionStatus: any;
    myDeviceId: DeviceID | null;
}>, import("redux").AnyAction>;
declare const networkActions: {
    setConnectionState: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
};
export declare type NetworkAction = ReturnType<ValueOf<typeof networkActions>>;
export {};
//# sourceMappingURL=network.d.ts.map