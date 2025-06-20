import { AnyInternalState, HashedKey, InternalState } from "@enun/state";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";

interface StateContext {
  stateMap: Map<HashedKey, AnyInternalState>;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  readState: <S extends InternalState<unknown>>(baseKey: HashedKey) => S;
}

const StateContext = createContext<StateContext | undefined>(undefined);

const useStateContextWith = (state: AnyInternalState | AnyInternalState[]): StateContext => {
  const context = useContext(StateContext);

  const stateMap = useMemo(() => {
    let newStateMap: Map<HashedKey, AnyInternalState>;
    if (context) {
      newStateMap = new Map<HashedKey, AnyInternalState>(context.stateMap);
    } else {
      newStateMap = new Map<HashedKey, AnyInternalState>();
    }

    if (Array.isArray(state)) {
      state.forEach(s => newStateMap.set(s.storeRef.key, s));
    } else {
      newStateMap.set(state.storeRef.key, state);
    }
    return newStateMap;
  }, [context, state]);

  const readState = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
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
  state: AnyInternalState | AnyInternalState[];
};
const States = (props: StatesProps) => {
  const context = useStateContextWith(props.state);
  return <StateContext value={context}>{props.children}</StateContext>;
};

export { StateContext, States };
