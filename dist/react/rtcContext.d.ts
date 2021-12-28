import { Store } from "@reduxjs/toolkit";
import React from "react";
import { ProducerID, SFU, SfuID } from "../network/sfu";
import { Action, State } from "../redux/reducer";
export declare class WebRtcManager {
    readonly store: Store<unknown, Action>;
    readonly selector: (s: unknown) => State;
    readonly getUrl: (id: SfuID) => URL;
    getTrack({ sfuId: sfu, producerId: producer }: TrackLocation): Promise<MediaStreamTrack>;
    microphoneConstraints?: MediaStreamConstraints["audio"];
    readonly microphone: TrackSender;
    cameraConstraints?: MediaStreamConstraints["video"];
    readonly camera: TrackSender;
    screenCaptureConstraints?: DisplayMediaStreamConstraints;
    readonly screenshare: StreamSender;
    globalPause({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    localPause({ sfuId, producerId }: TrackLocation, paused: boolean): Promise<void>;
    constructor(store: Store<unknown, Action>, selector: (s: unknown) => State, getUrl: (id: SfuID) => URL);
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
export declare class TrackSender {
    private readonly getSfu;
    private readonly getTrack;
    start(): Promise<void>;
    stop(): Promise<void>;
    get location(): TrackLocation | undefined;
    constructor(getSfu: () => SFU, getTrack: () => Promise<MediaStreamTrack>);
    private context?;
    private _location?;
    private send;
    private static pause;
}
export declare type TrackLocation = {
    sfuId: SfuID;
    producerId: ProducerID;
};
export declare const WebRtcContext: React.Context<WebRtcManager>;
//# sourceMappingURL=rtcContext.d.ts.map