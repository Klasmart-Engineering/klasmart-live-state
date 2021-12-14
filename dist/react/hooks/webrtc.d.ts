import { SfuID, ProducerID } from "../../network/sfu";
import { State } from "../../redux/reducer";
export declare function useCamera(): import("react-async-hook").UseAsyncReturn<MediaStream, any[]>;
export declare function useWebRtcState<T = unknown>(selector: (state: State) => T, equalityCheck?: (left: T, right: T) => boolean): T;
export declare function useMediaStream(sfuId: SfuID, ids: ProducerID[]): MediaStream;
export declare function useSendMediaStream(): import("react-async-hook").UseAsyncReturn<ProducerID[], [sfuId: SfuID, mediaStream: MediaStream]>;
export declare function useLocallyPauseMediaStream(): import("react-async-hook").UseAsyncReturn<void, [sfuId: SfuID, producerId: ProducerID]>;
export declare function useLocallyResumeMediaStream(): import("react-async-hook").UseAsyncReturn<void, [sfuId: SfuID, producerId: ProducerID]>;
export declare function useGloballyPauseMediaStream(): import("react-async-hook").UseAsyncReturn<void, [sfuId: SfuID, producerId: ProducerID]>;
export declare function useGloballyResumeMediaStream(): import("react-async-hook").UseAsyncReturn<void, [sfuId: SfuID, producerId: ProducerID]>;
//# sourceMappingURL=webrtc.d.ts.map