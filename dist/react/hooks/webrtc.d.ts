import { SfuID, ProducerID } from "../../network/sfu";
import { State } from "../../redux/reducer";
export declare function useCamera(): import("react-async-hook").UseAsyncReturn<MediaStream, any[]>;
export declare function useWebRtcState<T = unknown>(selector: (state: State) => T, equalityCheck?: (left: T, right: T) => boolean): T;
export declare function useSendMediaStream(): import("react-async-hook").UseAsyncReturn<ProducerID[], [sfuId: SfuID, mediaStream: MediaStream]>;
export declare function useMediaTrackIsPaused(sfuId: SfuID, producerId: ProducerID): boolean | undefined;
export declare function useLocallyPauseMediaTrack(): import("react-async-hook").UseAsyncReturn<void, [sfuId: SfuID, producerId: ProducerID, pause: boolean]>;
export declare function useGloballyPauseMediaStream(): import("react-async-hook").UseAsyncReturn<void, [sfuId: SfuID, producerId: ProducerID, pause: boolean]>;
//# sourceMappingURL=webrtc.d.ts.map