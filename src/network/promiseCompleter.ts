type PromiseCallbacks<S, E> = {
  resolve: (success: S) => void;
  reject: (error: E) => void;
};

export class PromiseCompleter<
  Success = void,
  Failure = Error,
  PromiseId = string
> {
    public constructor(
    private readonly callbacks = new Map<
      PromiseId,
      PromiseCallbacks<Success, Failure>
    >()
    ) {}

    public createPromise(id: PromiseId) {
        if (this.callbacks.has(id)) {
            throw new Error(`PromiseId(${id}) is already in-use`);
        }
        return new Promise<Success>((resolve, reject) => {
            this.callbacks.set(id, { resolve, reject });
        });
    }

    public resolve(id: PromiseId, result: Success) {
        this.useCallbacks(id).resolve(result);
    }

    public reject(id: PromiseId, error: Failure) {
        this.useCallbacks(id).reject(error);
    }

    private useCallbacks(requestId: PromiseId) {
        const completer = this.callbacks.get(requestId);
        if (!completer) {
            throw new Error(`Received response for unknown requestID(${requestId})`);
        }
        this.callbacks.delete(requestId);
        return completer;
    }
}
