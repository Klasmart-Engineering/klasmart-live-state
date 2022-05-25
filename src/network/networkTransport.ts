import {Mutex, withTimeout} from "async-mutex";
import {EventEmitter} from "eventemitter3";
import {printIfDebugLocksEnabled} from "./utils";

type Timeout = ReturnType<typeof setTimeout>;

export type NetworkTransportState = "connecting" | "connected" | "not-connected" | "error";

export type NetworkTransportEventMap = {
    statechange: [NetworkTransportState];
    message: string | ArrayBuffer | Blob;
}

export class NetworkTransport {
    private receiveTimeoutReference?: Timeout;
    private sendTimeoutReference?: Timeout;
    private ws?: WebSocket;
    private wsLock = withTimeout(new Mutex(), 10000);
    private emitter = new EventEmitter<NetworkTransportEventMap>();
    public readonly on: NetworkTransport["emitter"]["on"] = (event, listener) => this.emitter.on(event, listener);
    public readonly off: NetworkTransport["emitter"]["off"] = (event, listener) => this.emitter.off(event, listener);
    public readonly once: NetworkTransport["emitter"]["once"] = (event, listener) => this.emitter.once(event, listener);

    constructor(
    /* eslint-disable no-unused-vars */
        private readonly url: string,
        public protocols: string[] = [],
        private autoconnect = true,
        private receiveMessageTimeoutTime: number|null = 5000,
        private sendKeepAliveMessageInterval:number|null = 1000, /* eslint-enable no-unused-vars */
    ) {}

    public async connect() {
        try {
            await this._connect();
            return true;
        } catch (e) {
            return false;
        }
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

    @NetworkTransport.wsLock()
    private async _connect() {
        if (!this.ws || this.ws?.readyState === WebSocket.CLOSED || this.ws?.readyState === WebSocket.CLOSING) {
            this.ws = await new Promise((resolve, reject) => {
                const ws = new WebSocket(this.url, this.protocols);
                ws.binaryType = "arraybuffer";
                this.emitter.emit("statechange", "connecting");
                const connectionTimer = setTimeout(() => {
                    reject(new Error("Connection timeout"));
                    this.emitter.emit("statechange", "error");
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
        return this.ws;
    }

    private onMessage(data: string | ArrayBuffer | Blob) {
        this.resetNetworkReceiveTimeout();
        this.emitter.emit("message", data);
    }

    private onOpen() {
        this.resetNetworkSendTimeout();
        this.resetNetworkReceiveTimeout();
        this.emitter.emit("statechange", "connected");
    }

    private onClose() {
        this.ws = undefined;
        this.emitter.emit("statechange", "not-connected");
    }

    private onError() {
        this.emitter.emit("statechange", "error");
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

    /// Decorators
    // Decorator to make sure the underlying websocket is not being used by another method. Use via @NetworkTransport.wsLock().
    private static wsLock() {
        return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const childFunction = descriptor.value;
            descriptor.value = function (this: NetworkTransport, ...args: any[]) {
                try {
                    return this.wsLock.runExclusive(async () => {
                        printIfDebugLocksEnabled("Acquire WsLock");
                        return childFunction.apply(this, args);
                    });
                } finally {
                    printIfDebugLocksEnabled("Release WsLock");
                }
            };
            return descriptor;
        };
    }
}
