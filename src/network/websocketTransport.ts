type Timeout = ReturnType<typeof setTimeout>;

export type TransportState =
  | "not-connected"
  | "connected"
  | "connecting"
  | "error";
export class WSTransport {
    private receiveTimeoutReference?: Timeout;
    private sendTimeoutReference?: Timeout;

    constructor(
    /* eslint-disable no-unused-vars */
    private readonly url: string,
    private readonly onMessageCallback: (
      transport: WSTransport,
      data: string | ArrayBuffer | Blob
    ) => unknown,
    private readonly onStateChange?: (state: TransportState) => unknown,
    private readonly protocols: string[] | undefined = undefined,
    private autoconnect = true,
    private receiveMessageTimeoutTime: number|null = 5000,
    private sendKeepAliveMessageInterval:number|null = 1000 /* eslint-enable no-unused-vars */
    ) {}

    public async connect() {
        return this._connect().then(
            () => true,
            () => false
        );
    }

    public disconnect(code?: number | undefined, reason?: string): void {
        this.ws?.close(code, reason);
        if (this.receiveTimeoutReference) {
            clearTimeout(this.receiveTimeoutReference);
        }
        if (this.sendTimeoutReference) {
            clearTimeout(this.sendTimeoutReference);
        }
    }

    public async send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        let ws = this.ws;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            if (!this.autoconnect) {
                throw new Error("Not connected");
            }
            ws = await this._connect();
        }
        ws.send(data);
        this.resetNetworkSendTimeout();
    }

    private ws?: WebSocket;
    private _wsPromise?: Promise<WebSocket>;
    private async _connect() {
        if (!this._wsPromise || this.ws?.readyState === WebSocket.CLOSED || this.ws?.readyState === WebSocket.CLOSING) {
            this._wsPromise = new Promise<WebSocket>((resolve, reject) => {
                const ws = new WebSocket(this.url, this.protocols);
                ws.binaryType = "arraybuffer";
                this.onStateChange?.("connecting");
                const connectionTimer = setTimeout(() => {
                    reject(new Error("Connection timeout"));
                    this.onStateChange?.("error");
                    if (connectionTimer) {
                        clearTimeout(connectionTimer);
                    }
                    ws.close();
                }, 5000);
                ws.addEventListener("open", () => {
                    this.onOpen();
                    this.ws = ws;
                    if (connectionTimer) {
                        clearTimeout(connectionTimer);
                    }
                    resolve(ws);
                });

                ws.addEventListener("error", (e) => {
                    console.error(e);
                    this.onError();
                    reject(e);
                });

                ws.addEventListener("close", () => this.onClose());
                ws.addEventListener("message", (e) => this.onMessage(e.data));
            });
        }
        return await this._wsPromise;
    }

    private onMessage(data: string | ArrayBuffer | Blob) {
        this.resetNetworkReceiveTimeout();
        this.onMessageCallback(this, data);
    }

    private onOpen() {
        this.resetNetworkSendTimeout();
        this.resetNetworkReceiveTimeout();
        this.onStateChange?.("connected");
    }

    private onClose() {
        this.ws = undefined;
        this._wsPromise = undefined;
        this.onStateChange?.("not-connected");
    }

    private onError() {
        this.onStateChange?.("error");
    }

    private resetNetworkReceiveTimeout(): void {
        if(this.receiveMessageTimeoutTime === null) { return; }
        if (this.receiveTimeoutReference) {
            clearTimeout(this.receiveTimeoutReference);
        }
        this.receiveTimeoutReference = setTimeout(
            () => this.disconnect(4400, "timeout"),
            this.receiveMessageTimeoutTime
        );
    }

    private resetNetworkSendTimeout(): void {
        if(this.sendKeepAliveMessageInterval === null) { return; }
        if (this.sendTimeoutReference) {
            clearTimeout(this.sendTimeoutReference);
        }
        this.sendTimeoutReference = setTimeout(
            () => this.send(new Uint8Array(0)),
            this.sendKeepAliveMessageInterval
        );
    }
}
