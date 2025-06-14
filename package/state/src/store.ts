import { HashedKey } from "./key";

type Store<Stored> = {
  key: HashedKey;
  get: (key: HashedKey) => Stored | undefined;
  set: (key: HashedKey, value: Stored) => void;
  delete: (key: HashedKey) => void;
  forEach: (callback: (value: Stored, key: HashedKey) => void) => void;
  original: Map<HashedKey, Stored>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StoreMap = Map<HashedKey, Store<any>>;

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
    original: storedMap,
  };

  defaultStoreMap.set(baseKey, store);

  return store;
};

const isStoredLeft = (key: HashedKey) => {
  const store = defaultStoreMap.get(key);
  if (!store) return true;
  return store.original.size > 0;
};

const deleteStore = (key: HashedKey) => {
  defaultStoreMap.delete(key);
};

const getDefaultStoreMap = () => {
  const tree: Record<string, Record<string, unknown>> = {};
  for (const [key, value] of defaultStoreMap.entries()) {
    const subTree: Record<string, unknown> = {};
    value.forEach((value, key) => {
      subTree[key] = value;
    });
    tree[key] = subTree;
  }
  return tree;
};

export { createStore, deleteStore, getDefaultStoreMap, isStoredLeft };
export type { Store };
