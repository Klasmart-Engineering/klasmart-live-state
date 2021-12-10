import { useContext } from "react";
import NetworkContext from "../networkContext";
import { useSelector } from "react-redux";
import { State } from "../../redux/reducer";

export function useNetworkState<T = unknown>(
  selector: (state: State) => T,
  equalityCheck?: (left: T, right: T) => boolean
) {
  const network = useContext(NetworkContext);
  return useSelector(
    (state) => selector(network.selector(state)),
    equalityCheck
  );
}
