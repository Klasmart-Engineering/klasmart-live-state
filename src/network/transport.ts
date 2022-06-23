export abstract class Transport {
    static CLOSED: number;
    static CLOSING: number;
    static CONNECTING: number;
    static OPEN: number;
    public abstract send(data: string | ArrayBufferLike | Blob | ArrayBufferView): unknown;
    public abstract close(code?: number, reason?: string): unknown;
    public abstract addEventListener(event: string, listener: (...args: any[]) => unknown): unknown;
    public abstract readyState: number;
    public abstract binaryType?: string;
}
