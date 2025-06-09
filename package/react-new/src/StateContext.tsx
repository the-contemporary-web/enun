/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { HashedKey, InternalState } from "@enun/state";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";

interface StateContext {
  stateMap: Map<HashedKey, InternalState<any, any>>;
  readState: <S extends InternalState<unknown>>(baseKey: HashedKey) => S;
}

const StateContext = createContext<StateContext | undefined>(undefined);

const useStateContextWith = (state: InternalState<any, any> | InternalState<any, any>[]): StateContext => {
  const context = useContext(StateContext);

  const stateMap = useMemo(() => {
    let newStateMap: Map<HashedKey, InternalState<any, any>>;
    if (context) {
      newStateMap = new Map<HashedKey, InternalState<any, any>>(context.stateMap);
    } else {
      newStateMap = new Map<HashedKey, InternalState<any, any>>();
    }

    if (Array.isArray(state)) {
      state.forEach(s => newStateMap.set(s.storeRef.key, s));
    } else {
      newStateMap.set(state.storeRef.key, state);
    }
    return newStateMap;
  }, [context, state]);

  const readState = useCallback(
    <S extends InternalState<unknown>>(baseKey: HashedKey): S => {
      const state = stateMap.get(baseKey);
      if (!state) {
        throw new Error(`State not found: ${baseKey}`);
      }
      return state as S;
    },
    [stateMap],
  );

  return { stateMap, readState };
};

type StatesProps = PropsWithChildren & {
  state: InternalState<any, any> | InternalState<any, any>[];
};
const States = (props: StatesProps) => {
  const context = useStateContextWith(props.state);
  return <StateContext value={context}>{props.children}</StateContext>;
};

export { StateContext, States };
