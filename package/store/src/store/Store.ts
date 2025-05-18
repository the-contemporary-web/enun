import { createStore } from "zustand";

import { globalCacheManager, KeyHelper, RawKey } from "../cache";
import { StoreApiImpl } from "./StoreApi";
import {
  Composer,
  Decomposer,
  DefineStore,
  Dependencies,
  GetKeyDeps,
  Storable,
  Store,
  StoreApi,
  StoreBase,
} from "../type";

interface StoreBaseParam<T extends Storable, Deps extends Dependencies> {
  fingerPrint?: string;
  additionalKeys?: RawKey[];
  defineStore: DefineStore<T, Deps>;
  getKeyDeps?: GetKeyDeps<Deps>;
}

class StoreBaseImpl<T extends Storable, Deps extends Dependencies> implements StoreBase<T, Deps> {
  public readonly fingerPrint: string;
  public additionalKeys: RawKey[];
  private defineStore: DefineStore<T, Deps>;
  private getKeyDeps?: GetKeyDeps<Deps>;
  private toDestroy: Map<string, () => void>;

  constructor({ fingerPrint, additionalKeys, defineStore, getKeyDeps }: StoreBaseParam<T, Deps>) {
    this.fingerPrint = fingerPrint ?? KeyHelper.random();
    this.additionalKeys = additionalKeys ?? [];
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
    this.toDestroy = new Map();
  }

  private compose: Composer = composable => {
    this.toDestroy.set(composable.key, composable.destroy.bind(composable));
    const init = composable.get();
    return [composable, init] as const;
  };

  private decompose: Decomposer = composable => {
    this.toDestroy.delete(composable.key);
  };

  public api(...deps: Deps) {
    const key = this.hashKey(...deps);

    const init = () => {
      const zustandStore = createStore<T>()((set, get) =>
        this.defineStore(
          {
            get,
            set,
            compose: this.compose,
            decompose: this.decompose,
          },
          ...deps,
        ),
      );
      const onDestroy = () => {
        this.toDestroy.forEach(destroy => {
          destroy?.();
        });
      };

      return new StoreApiImpl({
        fingerPrint: this.fingerPrint,
        key,
        store: zustandStore,
        onDestroy,
      });
    };

    return globalCacheManager.retrieve<StoreApi<T>>({
      key,
      init,
    });
  }

  public hashKey(...deps: Deps) {
    const keyDeps = this.getKeyDeps?.(...deps);
    return KeyHelper.hash([this.fingerPrint, ...this.additionalKeys, keyDeps]);
  }

  private clone() {
    return new StoreBaseImpl({
      fingerPrint: this.fingerPrint,
      additionalKeys: [...this.additionalKeys],
      defineStore: this.defineStore,
      getKeyDeps: this.getKeyDeps,
    });
  }

  public appendKey(...keysToAppend: RawKey[]) {
    const clone = this.clone();
    clone.additionalKeys.push(...keysToAppend);
    return clone;
  }
  public local() {
    const clone = this.clone();
    clone.additionalKeys.push(KeyHelper.random());
    return clone;
  }
  public forEach(callbackFn: (storeApi: StoreApi<T>) => void) {
    const key = KeyHelper.hash([this.fingerPrint, ...this.additionalKeys]);
    globalCacheManager.match<StoreApi<T>>({ prefix: key, fn: callbackFn });
  }
}

const wrapStore = <T extends Storable, Deps extends Dependencies>(base: StoreBase<T, Deps>): Store<T, Deps> => {
  const fn = base.api.bind(base);

  const hashKey: Store<T, Deps>["hashKey"] = (...deps) => {
    return base.hashKey(...deps);
  };

  const appendKey: Store<T, Deps>["appendKey"] = (...keysToAppend) => {
    const newBase = base.appendKey.bind(base)(...keysToAppend);
    return wrapStore(newBase);
  };

  const local: Store<T, Deps>["local"] = () => {
    const newBase = base.local.bind(base)();
    return wrapStore(newBase);
  };

  const forEach: Store<T, Deps>["forEach"] = callbackFn => {
    base.forEach(callbackFn);
  };

  Object.assign(fn, {
    fingerPrint: base.fingerPrint,
    hashKey,
    appendKey,
    local,
    forEach,
  });

  return fn as Store<T, Deps>;
};

export { StoreBaseImpl, wrapStore };
