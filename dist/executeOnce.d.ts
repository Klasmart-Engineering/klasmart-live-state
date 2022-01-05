/**
 *  Decorator that ensures the decorated function body is executed only once, unless the function throws an error.
 *  All subsequent calls return the same value as the first call
 **/
export declare function ExecuteOnce(): (_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=executeOnce.d.ts.map