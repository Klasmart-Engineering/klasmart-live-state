/**
 *  Decorator that ensures the decorated function body is executed only once, unless the function throws an error.
 *  All subsequent calls return the same value as the first call
 **/
export function ExecuteOnce() {
    return (_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const childFunction = descriptor.value;
        if (typeof childFunction !== "function") {
            throw new TypeError(`Only methods can be decorated with @ExecuteOnce.  Property ${String(propertyKey)} is not a method.`);
        }
        let shouldReturnCache = false;
        let cache: unknown;
        descriptor.value = function (...args: any[]) {
            if(shouldReturnCache) { return cache; }
            try {
                const result = cache = childFunction.apply(this, args);
                shouldReturnCache = true;
                if(result instanceof Promise) { result.catch(() => shouldReturnCache = false); }
                return result;
            } catch (e) {
                shouldReturnCache = false;
                throw e;
            }

        };
        return descriptor;
    };
}