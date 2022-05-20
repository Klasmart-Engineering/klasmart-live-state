import { Request } from "../../network/sfu";
import { Transport } from "../../network/transport";

export class MockWS implements Transport {
    constructor(
        public url: string,
        public protocols: string[],
        public readyState: number,
    ){}

    public binaryType?: string;
    public static OPEN = 100;
    public static CLOSED = 200;
    public static CLOSING = 300;
    public static CONNECTING = 400;
    private eventHandlers = new Map<string, (...args: unknown[]) => unknown>();

    public close() {return console.log("mockws close");}
    public addEventListener(event: string, listener: (...args: unknown[]) => unknown) {this.eventHandlers.set(event, listener);}
    public send(data: string) {
        const handler = this.eventHandlers.get("message");
        if (!handler) {
            throw new Error("No handler for message");
        }
        // only for sfu requests
        const request: Request = JSON.parse(data);
        console.log(request);
        if (request.getRouterRtpCapabilities !== undefined) {
            const response = { data: {response: "Got router capabilities"}};
            return handler(response);
        }
        return handler();
    }
}