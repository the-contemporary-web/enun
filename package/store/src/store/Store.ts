import { createStore } from "zustand";

import { globalCacheManager, KeyHelper, RawKey } from "../cache";
import { StoreImpl } from "./StoreImpl";
import { DefineStore, GetKeyDeps } from "./type";

interface StoreParam<T extends object, Deps extends object> {
  defineStore: DefineStore<T, Deps>;
  getKeyDeps?: GetKeyDeps<Deps>;
}

class Store<T extends object, Deps extends object> {
  private fingerPrint: string;
  private additionalKeys: RawKey[];
  private defineStore: DefineStore<T, Deps>;
  private getKeyDeps?: GetKeyDeps<Deps>;

  constructor({ defineStore, getKeyDeps }: StoreParam<T, Deps>) {
    this.fingerPrint = KeyHelper.random();
    this.additionalKeys = [];
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
  }

  public use(deps: Deps) {
    const keyDeps = this.getKeyDeps?.(deps);
    const key = KeyHelper.hash([this.fingerPrint, ...this.additionalKeys, keyDeps]);

    const init = () => {
      const zustandStore = createStore<T>()(set => this.defineStore({ injected: deps, set }));
      return new StoreImpl({
        key,
        store: zustandStore,
      });
    };

    return globalCacheManager.retrieve<StoreImpl<T>>({
      key,
      init,
    });
  }
  public appendKey(...keysToAppend: RawKey[]) {
    this.additionalKeys.push(...keysToAppend);
    return this;
  }

  public forEach(callbackFn: (storeImplt: StoreImpl<T>) => void) {
    const key = KeyHelper.hash([this.fingerPrint, ...this.additionalKeys]);
    globalCacheManager.match<StoreImpl<T>>({ prefix: key, fn: callbackFn });
  }
}

export { Store };
