import React, { useMemo, ReactNode } from "react";
import { useStore } from "react-redux";
import { Action, State } from "../redux/reducer";
import { Network } from "../network/network";
import NetworkContext from "./networkContext";

export interface NetworkProviderProps<ApplicationState = unknown> {
  children?: ReactNode;
  selector: (state: ApplicationState) => State;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function NetworkProvider<ApplicationState = unknown>({
    children,
    selector,
}: NetworkProviderProps<ApplicationState>) {
    const store = useStore<ApplicationState, Action>();
    const value = useMemo(() => new Network(store, selector), [store, selector]);
    return (
        <NetworkContext.Provider value={value as Network<unknown>}>
            {children}
        </NetworkContext.Provider>
    );
}
