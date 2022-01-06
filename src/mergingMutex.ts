
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

export function MergingMutex<T, Args extends unknown[]>(f: (...args: Args) => Promise<T>) {
    let mutex: Promise<T> | undefined;
    const waitUntilUnlock = async () => {
        while(await mutex?.then(() => true, () => true)); 
    };
    return Object.assign(
        (...args: Args) => mutex ||= f(...args).finally(() => mutex = undefined),
        Object.freeze({ waitUntilUnlock }),
    );
}