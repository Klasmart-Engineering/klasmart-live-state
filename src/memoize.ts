/**
 *  ensures the function body is executed only once, unless the function throws an error.
 *  All subsequent calls return the same value as the first call
 **/
export const Memoize = <
    Parameters extends Array<unknown>,
    Return,
>(f: {(...args:Parameters): Return}): {(...args:Parameters): Return} => {
    let cache: {value: Return} | undefined;
    return (...args: Parameters) => {
        if(!cache) {cache = {value: f(...args)};}
        return cache.value;
    };
};
