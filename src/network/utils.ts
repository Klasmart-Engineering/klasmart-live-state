export function printIfDebugLocksEnabled(...args: unknown[]) {
    if(!process.env["DEBUG_LOCKS"]) { return; }
    console.log(...args);
}
