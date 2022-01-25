import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU } from "../network/sfu";
import { TrackLocation } from "./hooks/webrtc";
import { Room } from "../network/room";
export declare class WebRtcManager {
    readonly endpoint: URL;
    readonly sessionId?: string | undefined;
    microphoneConstraints?: MediaStreamConstraints["audio"];
    readonly microphone: TrackSender;
    cameraConstraints?: MediaStreamConstraints["video"];
    readonly camera: TrackSender;
    screenCaptureConstraints?: DisplayMediaStreamConstraints;
    readonly screenshare: StreamSender;
    getTrack({ sfuId, producerId }: TrackLocation): Promise<import("../network/sfu").Producer | import("../network/sfu").Consumer>;
    pauseForEveryone({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    pause({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    readonly room: Room;
    constructor(endpoint: URL, sessionId?: string | undefined);
    private readonly sfus;
    private sfu;
    private selectSfu;
    private getSfuUrl;
}
export declare class StreamSender {
    private readonly getSfu;
    private readonly getStream;
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly videoSender: TrackSender;
    readonly audioSender: TrackSender;
    constructor(getSfu: () => Promise<SFU>, getStream: () => Promise<MediaStream>);
}
export declare const WebRtcContext: React.Context<WebRtcManager>;
//# sourceMappingURL=rtcContext.d.ts.map