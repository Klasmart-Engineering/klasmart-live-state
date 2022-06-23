import {Transport} from "./transport";
export class WebSocketTransport implements Transport {
    static CLOSED = WebSocket.CLOSED;
    static CLOSING = WebSocket.CLOSING;
    static CONNECTING = WebSocket.CONNECTING;
    static OPEN = WebSocket.OPEN;
    constructor(public url: string, public protocols: string[]){
        this.ws = new WebSocket(url, protocols);
    }
    private ws: WebSocket;
    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView){this.ws.send(data);}
    public close(code?: number, reason?: string){this.ws.close(code, reason);}
    public addEventListener(event: string, listener: () => unknown){this.ws.addEventListener(event, listener);}
    public get readyState(){return this.ws.readyState;}
    public binaryType?: string;
}