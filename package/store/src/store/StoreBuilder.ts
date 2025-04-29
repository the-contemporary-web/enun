import { Store } from "./Store";
import { DefineStore, GetKeyDeps } from "./type";

interface StoreBuilderParam<T extends object, Deps extends object> {
  defineStore?: DefineStore<T, Deps>;
  getKeyDeps?: GetKeyDeps<Deps>;
}

class StoreBuilder<T extends object, Deps extends object> {
  private defineStore?: DefineStore<T, Deps>;
  private getKeyDeps?: GetKeyDeps<Deps>;

  constructor({ defineStore, getKeyDeps }: StoreBuilderParam<T, Deps>) {
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
  }

  public define(defineFn: DefineStore<T, Deps>) {
    this.defineStore = defineFn;
    return new Store<T, Deps>({
      defineStore: this.defineStore,
      getKeyDeps: this.getKeyDeps,
    });
  }

  public key(getFn: GetKeyDeps<Deps>) {
    return new StoreBuilder<T, Deps>({
      getKeyDeps: getFn,
    });
  }
}

export { StoreBuilder };
