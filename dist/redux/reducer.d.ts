import { ClassAction } from "./class";
import { NetworkAction } from "./network";
import { WebRtcAction } from "./webrtc";
export declare const reducer: import("redux").Reducer<import("redux").CombinedState<{
    class: import("../models").ClassState;
    network: import("redux").CombinedState<{
        connectionStatus: import("../network/websocketTransport").TransportState;
        myDeviceId: import("../models").DeviceID | null;
    }>;
    webrtc: import("./webrtc").WebRtcState;
}>, import("redux").AnyAction>;
export declare type State = ReturnType<typeof reducer>;
export declare type Action = ClassAction | NetworkAction | WebRtcAction;
//# sourceMappingURL=reducer.d.ts.map