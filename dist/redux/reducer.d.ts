import { ValueOf } from '../types';
import { ClassAction } from './class';
import { NetworkAction } from './network';
import { webrtcSlice } from './sfu';
export declare const reducer: import("redux").Reducer<import("redux").CombinedState<{
    class: import("../models").ClassState;
    network: import("redux").CombinedState<{
        connectionStatus: import("../network/websocketTransport").TransportState;
        myDeviceId: import("../models").DeviceID | null;
    }>;
    webrtc: import("./sfu").WebRtcState;
}>, import("redux").AnyAction>;
export declare type State = ReturnType<typeof reducer>;
export declare type Action = ClassAction | NetworkAction | ReturnType<ValueOf<typeof webrtcSlice.actions>>;
//# sourceMappingURL=reducer.d.ts.map