import { HashedKey } from "./key";

type Store<Stored> = {
  key: HashedKey;
  get: (key: HashedKey) => Stored | undefined;
  set: (key: HashedKey, value: Stored) => void;
  delete: (key: HashedKey) => void;
  forEach: (callback: (value: Stored, key: HashedKey) => void) => void;
};
type StoreMap = Map<HashedKey, Store<unknown>>;

const defaultStoreMap: StoreMap = new Map();

const createStore = <Stored>(baseKey: HashedKey): Store<Stored> => {
  const prev = defaultStoreMap.get(baseKey);
  if (prev) {
    return prev as Store<Stored>;
  }

  const storedMap = new Map<HashedKey, Stored>();

  const store = {
    key: baseKey,
    get: (key: HashedKey) => storedMap.get(key),
    set: (key: HashedKey, value: Stored) => storedMap.set(key, value),
    delete: (key: HashedKey) => storedMap.delete(key),
    forEach: (callback: (value: Stored, key: HashedKey) => void) => {
      storedMap.forEach(callback);
    },
  };

  return store;
};

export { createStore };
export type { Store };
