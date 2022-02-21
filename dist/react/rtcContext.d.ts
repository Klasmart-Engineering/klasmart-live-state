import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU } from "../network/sfu";
import { Room, TrackLocation } from "../network/room";
export declare class WebRtcManager {
    readonly baseEndpoint: URL;
    readonly sessionId?: string | undefined;
    private onAuthorizationInvalid?;
    private onAuthorizationExpired?;
    private onAuthenticationExpired?;
    private onAuthenticationInvalid?;
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
    constructor(baseEndpoint: URL, sessionId?: string | undefined, onAuthorizationInvalid?: (() => unknown) | undefined, onAuthorizationExpired?: (() => unknown) | undefined, onAuthenticationExpired?: (() => unknown) | undefined, onAuthenticationInvalid?: (() => unknown) | undefined);
    private onSfuError;
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