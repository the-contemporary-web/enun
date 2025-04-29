import { createStore } from "zustand";

import { globalCacheManager, KeyHelper, RawKey } from "../cache";
import { StoreImpl } from "./StoreImpl";
import { DefineStore, Destroyable, GetKeyDeps } from "./type";

interface StoreParam<T extends object, Deps extends object> {
  fingerPrint?: string;
  additionalKeys?: RawKey[];
  defineStore: DefineStore<T, Deps>;
  getKeyDeps?: GetKeyDeps<Deps>;
}

class Store<T extends object, Deps extends object> {
  public fingerPrint: string;
  public additionalKeys: RawKey[];
  private defineStore: DefineStore<T, Deps>;
  private getKeyDeps?: GetKeyDeps<Deps>;
  private toDestroy: Destroyable[];

  constructor({ fingerPrint, additionalKeys, defineStore, getKeyDeps }: StoreParam<T, Deps>) {
    this.fingerPrint = fingerPrint ?? KeyHelper.random();
    this.additionalKeys = additionalKeys ?? [];
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
    this.toDestroy = [];
  }

  public use(deps: Deps) {
    const key = this.hashKey(deps);

    const init = () => {
      const zustandStore = createStore<T>()(set =>
        this.defineStore({
          injected: deps,
          set,
          compose: destroyable => {
            this.toDestroy.push(destroyable);
            return destroyable;
          },
        }),
      );
      const onDestroy = () => {
        this.toDestroy.forEach(destroyable => {
          destroyable.destroy();
        });
      };

      return new StoreImpl({
        fingerPrint: this.fingerPrint,
        key,
        store: zustandStore,
        onDestroy,
      });
    };

    return globalCacheManager.retrieve<StoreImpl<T>>({
      key,
      init,
    });
  }

  public hashKey(deps: Deps) {
    const keyDeps = this.getKeyDeps?.(deps);
    return KeyHelper.hash([this.fingerPrint, ...this.additionalKeys, keyDeps]);
  }

  private clone() {
    return new Store({
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

  public forEach(callbackFn: (storeImplt: StoreImpl<T>) => void) {
    const key = KeyHelper.hash([this.fingerPrint, ...this.additionalKeys]);
    globalCacheManager.match<StoreImpl<T>>({ prefix: key, fn: callbackFn });
  }
}

export { Store };
