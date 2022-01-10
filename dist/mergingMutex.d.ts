/**
 * Returns a new function that wraps another async funciton with a mutex.
 *
 * When this new function is invoked it locks a mutex before calling the inner function,
 * If the mutex is locked then rather than invoking the function again, the promise from
 * the first invocation is returned, effectively merging the second invocation into the first.
 * Once the inner function's promise is fulfilled the mutex is unlocked.
 *
 * The new function also has a property `waitUntilUnlock`, an async function that waits for
 * the mutex to unlock without aquiring the mutex.
 */
export declare function MergingMutex<T, Args extends unknown[]>(f: (...args: Args) => Promise<T>): ((...args: Args) => Promise<T>) & Readonly<{
    waitUntilUnlock: () => Promise<void>;
}>;
//# sourceMappingURL=mergingMutex.d.ts.map