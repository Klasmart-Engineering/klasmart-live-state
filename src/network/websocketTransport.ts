type Timeout = ReturnType<typeof setTimeout>;

export type TransportState =
  | "not-connected"
  | "connected"
  | "connecting"
  | "error";
export class WSTransport {
  private recieveTimeoutReference?: Timeout;
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
    private recieveMessageTimeoutTime = 5000,
    private sendKeepAliveMessageInterval = 1000 /* eslint-enable no-unused-vars */
  ) {}

  public async connect() {
    return this._connect().then(
      () => true,
      () => false
    );
  }

  public disconnect(code?: number | undefined, reason?: string): void {
    this.ws?.close(code, reason);
    if (this.recieveTimeoutReference) {
      clearTimeout(this.recieveTimeoutReference);
    }
    if (this.sendTimeoutReference) {
      clearTimeout(this.sendTimeoutReference);
    }
  }

  public async send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    let ws = this.ws;
    if (!ws) {
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
    if (!this._wsPromise || this.ws?.readyState === WebSocket.CLOSED) {
      this._wsPromise = new Promise<WebSocket>((resolve, reject) => {
        const ws = (this.ws = new WebSocket(this.url, this.protocols));
        ws.binaryType = "arraybuffer";
        this.onStateChange?.("connecting");
        ws.addEventListener("open", () => {
          this.onOpen();
          resolve(ws);
        });
        ws.addEventListener("error", (e) => {
          this.onError();
          reject(e);
        });
        ws.addEventListener("close", () => this.onClose());
        ws.addEventListener("message", (e) => this.onMessage(e.data));
      });
    }
    return this._wsPromise;
  }

  private onMessage(data: string | ArrayBuffer | Blob) {
    this.resetNetworkRecieveTimeout();
    this.onMessageCallback(this, data);
  }

  private onOpen() {
    this.resetNetworkSendTimeout();
    this.resetNetworkRecieveTimeout();
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

  private resetNetworkRecieveTimeout(): void {
    if (this.recieveTimeoutReference) {
      clearTimeout(this.recieveTimeoutReference);
    }
    this.recieveTimeoutReference = setTimeout(
      () => this.disconnect(4400, "timeout"),
      this.recieveMessageTimeoutTime
    );
  }

  private resetNetworkSendTimeout(): void {
    if (this.sendTimeoutReference) {
      clearTimeout(this.sendTimeoutReference);
    }
    this.sendTimeoutReference = setTimeout(
      () => this.send(new Uint8Array(0)),
      this.sendKeepAliveMessageInterval
    );
  }
}