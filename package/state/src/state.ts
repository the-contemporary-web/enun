import { nanoid } from "nanoid";

import { compose as _compose, Composition } from "./compose";
import { HashedKey, hashKey, injectKey, RawKey } from "./key";
import { isPromiseLike } from "./promise";
import { createStore, Store } from "./store";
import { notify } from "./subscribe";
import { transform, Transformer } from "./transform";

interface State<Value> {
  key: HashedKey;
  value: Value;
  version: number;
  storeRef: Store<InternalState<Value>>;
  promise?: PromiseLike<Value>;
  error?: unknown;
  compositionRef?: Composition;
}
interface InternalState<Value> extends Omit<State<Value>, "value"> {
  value: Value | PromiseLike<Value>;
}

interface StatementInformation<Value> {
  baseKey: HashedKey;
  store: Store<InternalState<Value>>;
}
interface Statement<Value, Deps extends unknown[] = unknown[]> extends StatementInformation<Value> {
  (...deps: Deps): InternalState<Value>;
}

type Set<Value> = (
  input: Partial<Value> | Transformer<Value> | PromiseLike<Partial<Value>> | PromiseLike<Transformer<Value>>,
) => void;

interface StateApi<Value> {
  key: HashedKey;
  get: () => Value;
  set: Set<Value>;
  setStrict: (value: Value) => void;
  compose: <StateValue>(state: InternalState<StateValue>) => Promise<State<StateValue>>;
}

interface StateOptions<Value, Deps extends unknown[] = []> {
  is: (api: StateApi<Value>, ...deps: Deps) => Value | PromiseLike<Value>;
  as?: (...deps: Deps) => RawKey | true;
}

const state =
  <Value, Deps extends unknown[] = []>() =>
  ({ is, as }: StateOptions<Value, Deps>): Statement<Value, Deps> => {
    const baseKey = nanoid();
    const store = createStore<InternalState<Value>>(baseKey);

    const createApi = (key: HashedKey): StateApi<Value> => {
      const getState = (): State<Value> => {
        const state = store.get(key);
        if (!state) {
          throw new Error(`State not found for key: ${key}`);
        }
        if (isPromiseLike(state.value)) {
          throw new Error("State is not ready");
        }
        return state as State<Value>;
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

      const compose = <StateValue>(state: InternalState<StateValue>): Promise<State<StateValue>> => {
        _compose(key, state);
        return awaitState(state);
      };

      return {
        key,
        get,
        set,
        setStrict,
        compose,
      };
    };

    const statement = (...deps: Deps): InternalState<Value> => {
      const injectedKey = injectKey(as?.(...deps));
      const hashedKey = hashKey(baseKey, injectedKey);

      const prev = store.get(hashedKey);

      if (prev) {
        return prev;
      }

      const api = createApi(hashedKey);
      const value = is(api, ...deps);

      if (isPromiseLike(value)) {
        const state: InternalState<Value> = {
          key: hashedKey,
          value,
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

      const newState: State<Value> = {
        key: hashedKey,
        value,
        version: 0,
        storeRef: store,
      };
      store.set(hashedKey, newState);
      return newState;
    };

    const information: StatementInformation<Value> = {
      baseKey,
      store,
    };
    Object.assign(statement, information);
    return statement as Statement<Value, Deps>;
  };

const assureState = <Value>(key: HashedKey, store: Store<InternalState<Value>>): State<Value> => {
  const currentState = store.get(key);
  if (!currentState) {
    throw new Error(`State not found for key: ${store.key}.${key}`);
  }
  if (isPromiseLike(currentState.value)) {
    throw new Error("State is not ready");
  }
  return currentState as State<Value>;
};

const awaitState = async <Value>(state: InternalState<Value>): Promise<State<Value>> => {
  if (isPromiseLike(state.value)) {
    await state.value;
    return assureState(state.key, state.storeRef);
  }
  return assureState(state.key, state.storeRef);
};

const read = <Value>(state: State<Value>): Value => {
  return assureState(state.key, state.storeRef).value;
};

const writeStrict = <Value>(state: State<Value>, value: Value) => {
  const currentState = assureState(state.key, state.storeRef);
  currentState.value = value;
  currentState.promise = undefined;
  currentState.error = undefined;
  currentState.version++;
};

const write = <Value>(
  state: State<Value>,
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
