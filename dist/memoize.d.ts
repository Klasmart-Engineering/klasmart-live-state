/**
 *  ensures the function body is executed only once, unless the function throws an error.
 *  All subsequent calls return the same value as the first call
 **/
export declare const Memoize: <Parameters_1 extends unknown[], Return>(f: (...args: Parameters_1) => Return) => (...args: Parameters_1) => Return;
//# sourceMappingURL=memoize.d.ts.map