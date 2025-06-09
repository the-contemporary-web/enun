import { nanoid } from "nanoid";

import { HashedKey, hashKey, injectKey, RawKey } from "./key";
import { isPromiseLike } from "./promise";
import { createStore, Store } from "./store";
import { notify } from "./subscribe";
import { transform, Transformer } from "./transform";

interface State<Value, Action = unknown> {
  key: HashedKey;
  action: Action;
  value: Value;
  version: number;
  storeRef: Store<InternalState<Value, Action>>;
  promise?: PromiseLike<Value>;
  error?: unknown;
}
interface InternalState<Value, Action = unknown> extends Omit<State<Value, Action>, "value"> {
  value: Value | PromiseLike<Value>;
}

interface Statement<Value, Deps extends unknown[] = unknown[], Action = unknown> {
  baseKey: HashedKey;
  store: Store<InternalState<Value, Action>>;
  (...deps: Deps): InternalState<Value, Action>;
}

type Set<Value> = (
  input: Partial<Value> | Transformer<Value> | PromiseLike<Partial<Value>> | PromiseLike<Transformer<Value>>,
) => void;

interface StateApi<Value> {
  get: () => Value;
  set: Set<Value>;
  setStrict: (value: Value) => void;
}

const state =
  <Value, Deps extends unknown[] = []>() =>
  <Action>({
    is,
    as,
    acts,
  }: {
    is: (...deps: Deps) => Value | PromiseLike<Value>;
    as?: (...deps: Deps) => RawKey | true;
    acts?: (api: StateApi<Value>) => Action;
  }): Statement<Value, Deps, Action> => {
    const baseKey = nanoid();
    const store = createStore<InternalState<Value, Action>>(baseKey);

    const createApi = (key: HashedKey): StateApi<Value> => {
      const getState = (): State<Value, Action> => {
        const state = store.get(key);
        if (!state) {
          throw new Error(`State not found for key: ${key}`);
        }
        if (isPromiseLike(state.value)) {
          throw new Error("State is not ready");
        }
        return state as State<Value, Action>;
      };

      const get = () => {
        return getState().value;
      };

      const setStrict = (value: Value) => {
        const state = getState();
        state.value = value;
        state.promise = undefined;
        state.error = undefined;
        state.version++;
        notify(state.key);
      };

      const set: Set<Value> = input => {
        const state = getState();
        if (isPromiseLike(input)) {
          const promise = input.then(resolvedInput => {
            const prev = get();
            const newValue = transform(prev, resolvedInput);
            setStrict(newValue);
            return newValue;
          });
          state.promise = promise;
          state.version++;
          notify(state.key);
          return;
        }
        const newValue = transform(state.value, input);
        setStrict(newValue);
      };

      return { get, set, setStrict };
    };

    const inject = (...deps: Deps): InternalState<Value, Action> => {
      const injectedKey = injectKey(as?.(...deps));
      const hashedKey = hashKey(baseKey, injectedKey);

      const prev = store.get(hashedKey);

      if (prev) {
        return prev;
      }

      const value = is(...deps);

      if (isPromiseLike(value)) {
        const api = createApi(hashedKey);
        const action = acts?.(api) as Action;

        const state: InternalState<Value, Action> = {
          key: hashedKey,
          value,
          action,
          version: 0,
          storeRef: store,
        };
        value.then(resolvedValue => {
          state.value = resolvedValue;
          store.set(hashedKey, state);
        });
        store.set(hashedKey, state);
        return state;
      }
      const api = createApi(hashedKey);
      const action = acts?.(api) as Action;

      return {
        key: hashedKey,
        value,
        action,
        version: 0,
        storeRef: store,
      };
    };

    const statement = inject;
    Object.assign(statement, {
      baseKey,
      store,
    });

    return statement as Statement<Value, Deps, Action>;
  };

const assureState = <Value, Action = unknown>(
  key: HashedKey,
  store: Store<InternalState<Value, Action>>,
): State<Value, Action> => {
  const currentState = store.get(key);
  if (!currentState) {
    throw new Error(`State not found for key: ${store.key}.${key}`);
  }
  if (isPromiseLike(currentState.value)) {
    throw new Error("State is not ready");
  }
  return currentState as State<Value, Action>;
};

const awaitState = async <Value, Action = unknown>(
  state: InternalState<Value, Action>,
): Promise<State<Value, Action>> => {
  if (isPromiseLike(state.value)) {
    await state.value;
    return assureState(state.key, state.storeRef);
  }
  return assureState(state.key, state.storeRef);
};

const read = <Value, Action = unknown>(state: State<Value, Action>): Value => {
  return assureState(state.key, state.storeRef).value;
};

const writeStrict = <Value, Action = unknown>(state: State<Value, Action>, value: Value) => {
  const currentState = assureState(state.key, state.storeRef);
  currentState.value = value;
  currentState.promise = undefined;
  currentState.error = undefined;
  currentState.version++;
};

const write = <Value, Action = unknown>(
  state: State<Value, Action>,
  input: Partial<Value> | Transformer<Value> | PromiseLike<Partial<Value>> | PromiseLike<Transformer<Value>>,
) => {
  const currentState = assureState(state.key, state.storeRef);
  if (isPromiseLike(input)) {
    const promise = input.then(resolvedInput => {
      const currentState = assureState(state.key, state.storeRef);
      const newValue = transform(currentState.value, resolvedInput);
      writeStrict(currentState, newValue);
      return newValue;
    });
    currentState.promise = promise;
    currentState.version++;
    return;
  }
  const newValue = transform(currentState.value, input);
  writeStrict(currentState, newValue);
};

export { assureState, awaitState, read, state, write };
export type { InternalState, State, Statement };
