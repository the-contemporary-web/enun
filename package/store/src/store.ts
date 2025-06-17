type CreateStoreParam<Key, Value> = {
  init?: (base: Map<Key, Value>) => Value;
  shouldDelete?: (value: Value, base: Map<Key, Value>) => boolean | undefined;
};
type Store<Key, Value> = {
  base: Map<Key, Value>;
  get: (key: Key) => Value | undefined;
  safeGet: (key: Key) => Value;
  set: (key: Key, value: Value) => void;
  delete: (key: Key) => void;
  alive: (key: Key) => boolean;
  clean: (key: Key) => void;
  cleanAll: () => void;
  size: number;
  forEach: (callback: (value: Value, key: Key) => void) => void;
};

const createStore = <Key, Value>({ init, shouldDelete }: CreateStoreParam<Key, Value>): Store<Key, Value> => {
  const base = new Map<Key, Value>();

  const get = (key: Key) => base.get(key);
  const safeGet = (key: Key) => {
    let value = base.get(key);
    if (value === undefined) {
      if (!init) {
        throw new Error("Init must be provided to use safeGet");
      }
      value = init(base);
      base.set(key, value);
    }
    return value;
  };

  const set = (key: Key, value: Value) => {
    base.set(key, value);
  };

  const _delete = (key: Key) => {
    base.delete(key);
  };
  const alive = (key: Key) => {
    const value = base.get(key);
    return (value && !shouldDelete?.(value, base)) ?? false;
  };
  const clean = (key: Key) => {
    if (alive(key)) return;
    _delete(key);
  };
  const cleanAll = () => {
    base.forEach((value, key) => {
      if (value && shouldDelete?.(value, base)) {
        base.delete(key);
      }
    });
  };

  const size = base.size;
  const forEach = (callback: (value: Value, key: Key) => void) => {
    base.forEach(callback);
  };

  return {
    base,
    get,
    safeGet,
    set,
    delete: _delete,
    alive,
    clean,
    cleanAll,
    size,
    forEach,
  };
};

export { createStore };
export type { Store };
