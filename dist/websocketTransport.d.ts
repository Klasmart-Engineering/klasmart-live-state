export declare type TransportState = "not-connected" | "connected" | "connecting" | "error";
export declare class WSTransport {
    private readonly url;
    private readonly onMessageCallback;
    private readonly onStateChange?;
    private readonly protocols;
    private autoconnect;
    private recieveMessageTimeoutTime;
    private sendKeepAliveMessageInterval;
    private recieveTimeoutReference?;
    private sendTimeoutReference?;
    constructor(url: string, onMessageCallback: (transport: WSTransport, data: string | ArrayBuffer | Blob) => unknown, onStateChange?: ((state: TransportState) => unknown) | undefined, protocols?: string[] | undefined, autoconnect?: boolean, recieveMessageTimeoutTime?: number, sendKeepAliveMessageInterval?: number);
    connect(): Promise<boolean>;
    disconnect(code?: number | undefined, reason?: string): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): Promise<void>;
    private ws?;
    private _wsPromise?;
    private _connect;
    private onMessage;
    private onOpen;
    private onClose;
    private onError;
    private resetNetworkRecieveTimeout;
    private resetNetworkSendTimeout;
}
//# sourceMappingURL=websocketTransport.d.ts.map