import { createStore } from "zustand";

import { globalCacheManager, KeyHelper, RawKey } from "../cache";
import { StoreImpl } from "./StoreImpl";
import { ComposeMap, Composer, DefineStore, GetKeyDeps } from "./type";

interface StoreParam<T extends object, Deps extends object, Composed extends ComposeMap> {
  fingerPrint?: string;
  additionalKeys?: RawKey[];
  defineStore: DefineStore<T, Deps, Composed>;
  getKeyDeps?: GetKeyDeps<Deps>;
  composeStore?: Composer<Deps, Composed>;
}

class Store<T extends object, Deps extends object, Composed extends ComposeMap> {
  public fingerPrint: string;
  public additionalKeys: RawKey[];
  private defineStore: DefineStore<T, Deps, Composed>;
  private getKeyDeps?: GetKeyDeps<Deps>;
  private composeStore?: Composer<Deps, Composed>;

  constructor({ fingerPrint, additionalKeys, defineStore, getKeyDeps, composeStore }: StoreParam<T, Deps, Composed>) {
    this.fingerPrint = fingerPrint ?? KeyHelper.random();
    this.additionalKeys = additionalKeys ?? [];
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

  private clone() {
    return new Store({
      fingerPrint: this.fingerPrint,
      additionalKeys: [...this.additionalKeys],
      defineStore: this.defineStore,
      getKeyDeps: this.getKeyDeps,
      composeStore: this.composeStore,
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
