import {
  abortDestroy,
  assureState,
  destroy,
  InternalState,
  isPromiseLike,
  State,
  Statement,
  StateStore,
  subscribe,
} from "@enun/state";
import { use, useContext, useEffect, useReducer } from "react";

import { StateContext } from "./StateContext";

const useStateOf = <Value, Deps extends unknown[]>(
  input: InternalState<Value> | Statement<Value, Deps>,
): State<Value> => {
  const context = useContext(StateContext);
  const store = isStatement(input) ? input.store : input.storeRef;
  const key = (() => {
    if (isStatement(input)) {
      if (!context) throw new Error("StateContext not found");
      return context.readState(input.baseKey).key;
    }
    return input.key;
  })();

  const [[currentState, currentStore], rerender] = useReducer(
    prev => {
      const nextState = assureState(key, store);
      if (prev[2] === nextState.version) {
        return prev;
      }
      return [nextState, nextState.storeRef, nextState.version] as const;
    },
    undefined,
    () => {
      const currentState = store.get(key);
      if (!currentState) {
        throw new Error("State not found");
      }
      abortDestroy(key);
      return [currentState, store, currentState.version] as const;
    },
  );

  let value = currentState.value;
  if (!isStateInputEqual(input, currentState, currentStore)) {
    value = currentState.value;
    abortDestroy(key);
  }

  useEffect(() => {
    const unsubscribe = subscribe(currentState, rerender);
    abortDestroy(currentState.key);
    return () => {
      unsubscribe();
      destroy(currentState);
    };
  }, [currentState]);

  if (isPromiseLike(value)) {
    value = use(value);
  }

  return {
    ...currentState,
    value,
  };
};

const isStatement = <Value, Deps extends unknown[]>(
  input: InternalState<Value> | Statement<Value, Deps>,
): input is Statement<Value, Deps> => {
  return "store" in input;
};

const isStateInputEqual = <Value, Deps extends unknown[]>(
  input: InternalState<Value> | Statement<Value, Deps>,
  stateToCompare: InternalState<Value>,
  storeToCompare: StateStore<Value>,
) => {
  if (isStatement(input)) {
    return Object.is(input.store, storeToCompare);
  }
  return Object.is(input, stateToCompare);
};

export { useStateOf };
