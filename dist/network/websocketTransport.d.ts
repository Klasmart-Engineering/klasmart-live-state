export declare type TransportState = "not-connected" | "connected" | "connecting" | "error";
export declare class WSTransport {
    private readonly url;
    private readonly onMessageCallback;
    private readonly onStateChange?;
    private readonly protocols;
    private autoconnect;
    private receiveMessageTimeoutTime;
    private sendKeepAliveMessageInterval;
    private receiveTimeoutReference?;
    private sendTimeoutReference?;
    constructor(url: string, onMessageCallback: (transport: WSTransport, data: string | ArrayBuffer | Blob) => unknown, onStateChange?: ((state: TransportState) => unknown) | undefined, protocols?: string[] | undefined, autoconnect?: boolean, receiveMessageTimeoutTime?: number | null, sendKeepAliveMessageInterval?: number | null);
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
    private resetNetworkReceiveTimeout;
    private resetNetworkSendTimeout;
}
//# sourceMappingURL=websocketTransport.d.ts.map