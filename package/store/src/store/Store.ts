import { createStore } from "zustand";

import { globalCacheManager, KeyHelper, RawKey } from "../cache";
import { StoreImpl } from "./StoreImpl";
import { ComposeMap, Composer, DefineStore, GetKeyDeps } from "./type";

interface StoreParam<T extends object, Deps extends object, Composed extends ComposeMap> {
  defineStore: DefineStore<T, Deps, Composed>;
  getKeyDeps?: GetKeyDeps<Deps>;
  composeStore?: Composer<Deps, Composed>;
}

class Store<T extends object, Deps extends object, Composed extends ComposeMap> {
  private fingerPrint: string;
  private additionalKeys: RawKey[];
  private defineStore: DefineStore<T, Deps, Composed>;
  private getKeyDeps?: GetKeyDeps<Deps>;
  private composeStore?: Composer<Deps, Composed>;

  constructor({ defineStore, getKeyDeps, composeStore }: StoreParam<T, Deps, Composed>) {
    this.fingerPrint = KeyHelper.random();
    this.additionalKeys = [];
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
    this.composeStore = composeStore;
  }

  public use(deps: Deps) {
    const keyDeps = this.getKeyDeps?.(deps);
    const key = KeyHelper.hash([this.fingerPrint, ...this.additionalKeys, keyDeps]);

    const init = () => {
      const composed = (this.composeStore?.(deps) ?? {}) as Composed;
      const zustandStore = createStore<T>()(set => this.defineStore({ injected: deps, composed, set }));

      const onDestroy = () => {
        Object.values(composed).forEach(store => store.destroy());
      };

      return new StoreImpl({
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
  public appendKey(...keysToAppend: RawKey[]) {
    this.additionalKeys.push(...keysToAppend);
    return this;
  }
  public local() {
    this.additionalKeys.push(KeyHelper.random());
    return this;
  }

  public forEach(callbackFn: (storeImplt: StoreImpl<T>) => void) {
    const key = KeyHelper.hash([this.fingerPrint, ...this.additionalKeys]);
    globalCacheManager.match<StoreImpl<T>>({ prefix: key, fn: callbackFn });
  }
}

export { Store };
