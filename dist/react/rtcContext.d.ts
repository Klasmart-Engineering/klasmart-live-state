import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU, SfuId } from "../network/sfu";
import { TrackLocation } from "./hooks/webrtc";
export declare class WebRtcManager {
    readonly getUrl: (id: SfuId) => URL;
    microphoneConstraints?: MediaStreamConstraints["audio"];
    readonly microphone: TrackSender;
    cameraConstraints?: MediaStreamConstraints["video"];
    readonly camera: TrackSender;
    screenCaptureConstraints?: DisplayMediaStreamConstraints;
    readonly screenshare: StreamSender;
    getTrack({ sfuId, producerId }: TrackLocation): Promise<import("../network/sfu").Producer | import("../network/sfu").Consumer>;
    pauseForEveryone({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    pause({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    constructor(getUrl: (id: SfuId) => URL);
    private readonly sfus;
    private sfu;
}
export declare class StreamSender {
    private readonly getSfu;
    private readonly getStream;
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly videoSender: TrackSender;
    readonly audioSender: TrackSender;
    constructor(getSfu: () => SFU, getStream: () => Promise<MediaStream>);
}
export declare const WebRtcContext: React.Context<WebRtcManager>;
//# sourceMappingURL=rtcContext.d.ts.map