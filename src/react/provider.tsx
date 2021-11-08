import React, { FC, useMemo, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { State } from "../ui";
import { Network } from "../network";
import NetworkContext from "./context";

export interface NetworkProviderProps {
  children?: ReactNode;
  selector: (state: unknown) => State;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const NetworkProvider: FC<NetworkProviderProps> = ({
  children,
  selector,
}) => {
  const dispatch = useDispatch();
  const value = useMemo(() => new Network(dispatch, selector), []);
  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
