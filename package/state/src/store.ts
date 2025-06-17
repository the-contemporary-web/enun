import { createStore, Store } from "@enun/store";

import { AnyStateStore } from "./any";
import { HashedKey } from "./key";
import { InternalState } from "./state";

interface StateStore<Value> extends Store<HashedKey, InternalState<Value>> {
  key: HashedKey;
}

const stateStores = createStore<HashedKey, AnyStateStore>({
  shouldDelete: store => store.base.size === 0,
});

const createStateStore = <Value>(key: HashedKey) => {
  const stateStore = createStore<HashedKey, InternalState<Value>>({});
  const stateStoreWithKey: StateStore<Value> = {
    ...stateStore,
    key,
  };
  stateStores.set(key, stateStoreWithKey);
  return stateStoreWithKey;
};

const isStatesLeft = (key: HashedKey) => {
  return stateStores.alive(key);
};

const deleteStateStore = (key: HashedKey) => {
  stateStores.delete(key);
};

const debugStateStores = () => {
  const tree: Record<string, Record<string, unknown>> = {};
  for (const [key, value] of stateStores.base.entries()) {
    const subTree: Record<string, unknown> = {};
    value.forEach((value, key) => {
      subTree[key] = value;
    });
    tree[key] = subTree;
  }
  return tree;
};

export { createStateStore, debugStateStores, deleteStateStore, isStatesLeft };
export type { StateStore };

// const createStore = <Stored>(baseKey: HashedKey): Store<Stored> => {
//   const prev = defaultStoreMap.get(baseKey);
//   if (prev) {
//     return prev as Store<Stored>;
//   }

//   const storedMap = new Map<HashedKey, Stored>();

//   const store = {
//     key: baseKey,
//     get: (key: HashedKey) => storedMap.get(key),
//     set: (key: HashedKey, value: Stored) => storedMap.set(key, value),
//     delete: (key: HashedKey) => storedMap.delete(key),
//     forEach: (callback: (value: Stored, key: HashedKey) => void) => {
//       storedMap.forEach(callback);
//     },
//     original: storedMap,
//   };

//   defaultStoreMap.set(baseKey, store);

//   return store;
// };

// const deleteStore = (key: HashedKey) => {
//   defaultStoreMap.delete(key);
// };

// export { createStore, deleteStore, getDefaultStoreMap, isStoredLeft };
// export type { StateStore };
