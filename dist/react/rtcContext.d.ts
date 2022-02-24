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
    private onTokenMismatch?;
    private onMissingAuthenticationToken?;
    private onMissingAuthorizationToken?;
    microphoneConstraints?: MediaStreamConstraints["audio"];
    readonly microphone: TrackSender;
    cameraConstraints?: MediaStreamConstraints["video"];
    readonly camera: TrackSender;
    screenshareConstraints?: DisplayMediaStreamConstraints;
    readonly screenshare: TrackSender;
    getTrack({ sfuId, producerId }: TrackLocation): Promise<import("../network/sfu").Producer | import("../network/sfu").Consumer>;
    pauseForEveryone({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    pause({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    readonly room: Room;
    constructor(baseEndpoint: URL, sessionId?: string | undefined, onAuthorizationInvalid?: (() => unknown) | undefined, onAuthorizationExpired?: (() => unknown) | undefined, onAuthenticationExpired?: (() => unknown) | undefined, onAuthenticationInvalid?: (() => unknown) | undefined, onTokenMismatch?: (() => unknown) | undefined, onMissingAuthenticationToken?: (() => unknown) | undefined, onMissingAuthorizationToken?: (() => unknown) | undefined);
    private onSfuError;
    private readonly sfus;
    private sfu;
    private selectSfu;
    private getSfuUrl;
}
export declare class StreamSender {
    private readonly getSfu;
    private readonly name;
    private readonly sessionId?;
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly videoSender: TrackSender;
    readonly audioSender: TrackSender;
    private readonly getStream;
    constructor(getSfu: () => Promise<SFU>, getStream: () => Promise<MediaStream>, name: string, sessionId?: string | undefined);
}
export declare const audioTrack: (stream: Promise<MediaStream>) => Promise<MediaStreamTrack>;
export declare const videoTrack: (stream: Promise<MediaStream>) => Promise<MediaStreamTrack>;
export declare const firstTrack: (tracks: MediaStreamTrack[]) => MediaStreamTrack;
export declare const WebRtcContext: React.Context<WebRtcManager>;
//# sourceMappingURL=rtcContext.d.ts.map