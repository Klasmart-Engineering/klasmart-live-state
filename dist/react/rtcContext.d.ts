import React from "react";
import { TrackSender } from "../network/trackSender";
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
    private onSfuConnectionError;
    private onSfuAuthError;
    private readonly sfus;
    private sfu;
    private selectProducerSfu;
    private getSfuUrl;
}
export declare const audioTrack: (stream: Promise<MediaStream>) => Promise<MediaStreamTrack>;
export declare const videoTrack: (stream: Promise<MediaStream>) => Promise<MediaStreamTrack>;
export declare const firstTrack: (tracks: MediaStreamTrack[]) => MediaStreamTrack;
export declare const WebRtcContext: React.Context<WebRtcManager>;
//# sourceMappingURL=rtcContext.d.ts.map