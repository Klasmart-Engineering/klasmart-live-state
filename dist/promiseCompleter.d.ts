declare type PromiseCallbacks<S, E> = {
    resolve: (success: S) => void;
    reject: (error: E) => void;
};
export declare class PromiseCompleter<Success = void, Failure = Error, PromiseId = string> {
    private readonly callbacks;
    constructor(callbacks?: Map<PromiseId, PromiseCallbacks<Success, Failure>>);
    createPromise(id: PromiseId): Promise<Success>;
    resolve(id: PromiseId, result: Success): void;
    reject(id: PromiseId, error: Failure): void;
    private useCallbacks;
}
export {};
//# sourceMappingURL=promiseCompleter.d.ts.map