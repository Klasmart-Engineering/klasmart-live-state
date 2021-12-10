import { Store } from "@reduxjs/toolkit";
import { Action, ClassActionType, NetworkHandlerCallback, State } from "../ui";
import { NewType } from "../types";
import { IClassRequest } from "../protobuf";
export declare type RequestID = NewType<string, "RequestID">;
export declare const newRequestId: (value: string) => RequestID;
export declare class Network<ApplicationState = unknown> {
    readonly store: Store<ApplicationState, Action>;
    readonly selector: (s: ApplicationState) => State;
    private readonly rpc;
    private transport?;
    private readonly actionEmitter;
    constructor(store: Store<ApplicationState, Action>, selector: (s: ApplicationState) => State);
    onClassAction<T extends ClassActionType = ClassActionType>(actionType: T, f: NetworkHandlerCallback<T>): () => void;
    connect(url: string): Promise<boolean>;
    disconnect(code?: number, reason?: string): void;
    private onStateChange;
    private onNetworkMessage;
    private handleResponse;
    send(command: IClassRequest): Promise<void>;
}
//# sourceMappingURL=network.d.ts.map