import { EventEmitter } from 'eventemitter3';

export type PromiseCompleter<S,E> = {
    resolve: (success:S) => void,
    reject: (error: E) => void,
}

export class RPC<RequestID, Request, ResponseSuccess, ResponseError> {
    private resolve = new Map<
        RequestID,
        PromiseCompleter<ResponseSuccess, ResponseError>
    >()
    
    public constructor(
        private sendHandler: (request: Request) => unknown,
    ) {}

    public send(requestId: RequestID, request: Request) {
        if(this.resolve.has(requestId)) {throw new Error(`RequestId(${requestId}) is already in-use`)}
        this.sendHandler(request)
        return new Promise<ResponseSuccess>((resolve, reject) => {this.resolve.set(requestId, {resolve, reject})})
    }

    public success(requestId: RequestID, response: ResponseSuccess) {
        this.completePromise(requestId).resolve(response);
    }

    public error(requestId: RequestID, error: ResponseError) {
        this.completePromise(requestId).reject(error);
    }

    private completePromise(requestId: RequestID) {
        const completer = this.resolve.get(requestId);
        if (!completer) { throw new Error(`Recieved response for unknown requestID(${requestId})`); }
        this.resolve.delete(requestId);
        return completer
    }
}

export type TransportState = "not-connected" | "connected" | "connecting" | "error"
export class WSTransport {
    private recieveTimeoutReference?: number
    private sendTimeoutReference?: number

    constructor(
        /* eslint-disable no-unused-vars */
        private readonly url: string,
        private readonly onMessageCallback: (transport: WSTransport, data: string | ArrayBuffer | Blob) => unknown,
        private readonly onStateChange?: (transport: WSTransport, state: TransportState) => unknown,
        private readonly protocols: string[] | undefined = undefined,
        private autoconnect = true,
        private recieveMessageTimeoutTime = 5000,
        private sendKeepAliveMessageInterval = 1000, 
        /* eslint-enable no-unused-vars */
    ) { }

    public async connect() {
        return this._connect().then(() => true, () => false)
    }



    private ws?: WebSocket
    private _wsPromise?: Promise<WebSocket>
    private async _connect() {
        if(!this._wsPromise || this.ws?.readyState === WebSocket.CLOSED) {
            this._wsPromise = new Promise<WebSocket>((resolve, reject) => {
                const ws = this.ws = new WebSocket(this.url, this.protocols)
                ws.binaryType = "arraybuffer"
                this.onStateChange?.('connecting');
                ws.addEventListener('open', () => { this.onOpen(); resolve(ws); })
                ws.addEventListener('error', (e) => {this.onError(); reject(e);})
                ws.addEventListener('close', () => this.onClose())
                ws.addEventListener('message', (e) => this.onMessage(e.data))
            })
        }
        return this._wsPromise
    }

    private onMessage(data: string | ArrayBuffer | Blob) {
        this.resetNetworkRecieveTimeout()
        this.onMessageCallback(data)
    }

    private onOpen() {
        this.resetNetworkSendTimeout();
        this.resetNetworkRecieveTimeout();
        this.onStateChange?.('connected');
    }

    private onClose() {
        this.ws = undefined;
        this._wsPromise = undefined;
        this.onStateChange?.('not-connected');
    }

    private onError() {
        this.onStateChange?.('error');
    }

    public async close(code: number | undefined = 4500, reason?: string): Promise<void> {
        this.ws?.close(code, reason);
    }

    public async send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        let ws = this.ws
        if(!ws) {
            if(!this.autoconnect) { throw new Error('Not connected') }
            ws = await this._connect()
        } 
        ws.send(data)
        this.resetNetworkSendTimeout()
    }

    private resetNetworkRecieveTimeout(): void {
        if (this.recieveTimeoutReference !== undefined) { clearTimeout(this.recieveTimeoutReference); }
        this.recieveTimeoutReference = setTimeout(() => this.close(4400, 'timeout'), this.recieveMessageTimeoutTime);
    }

    private resetNetworkSendTimeout(): void {
        if (this.sendTimeoutReference) { clearTimeout(this.sendTimeoutReference); }
        this.sendTimeoutReference = setTimeout(() => this.send(new Uint8Array(0)), this.sendKeepAliveMessageInterval);
    }
}