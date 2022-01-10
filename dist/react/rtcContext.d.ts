import { Store } from "@reduxjs/toolkit";
import React from "react";
import { TrackSender } from "../network/trackSender";
import { SFU, SfuId, TrackLocation } from "../network/sfu";
import { Action, State } from "../redux/reducer";
export declare class WebRtcManager {
    readonly store: Store<unknown, Action>;
    readonly selector: (s: unknown) => State;
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
    constructor(store: Store<unknown, Action>, selector: (s: unknown) => State, getUrl: (id: SfuId) => URL);
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