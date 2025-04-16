import { Store } from "./Store";
import { DefineStore, GetKeyDeps } from "./type";

class StoreBuilder<T extends object, Deps extends object> {
  defineStore?: DefineStore<T, Deps>;
  getKeyDeps?: GetKeyDeps<Deps>;

  constructor() {}

  public define(defineFn: DefineStore<T, Deps>) {
    this.defineStore = defineFn;
    return new Store({
      defineStore: this.defineStore,
      getKeyDeps: this.getKeyDeps,
    });
  }

  public key(getFn: GetKeyDeps<Deps>) {
    this.getKeyDeps = getFn;
    return this;
  }

  public compose() {}
}

export { StoreBuilder };
