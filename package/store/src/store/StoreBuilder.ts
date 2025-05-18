import { KeyHelper, RawKey } from "../cache";
import { DefineStore, Dependencies, GetKeyDeps, Storable, StoreBuilder } from "../type";
import { wrapStore, StoreBaseImpl } from "./Store";

interface StoreBuilderParam<T extends Storable, Deps extends Dependencies> {
  defineStore?: DefineStore<T, Deps>;
  getKeyDeps?: GetKeyDeps<Deps>;
  additionalKeys?: RawKey[];
}

class StoreBuilderImpl<T extends Storable, Deps extends Dependencies> implements StoreBuilder<T, Deps> {
  private defineStore?: DefineStore<T, Deps>;
  private getKeyDeps?: GetKeyDeps<Deps>;
  private additionalKeys: RawKey[];

  constructor({ defineStore, getKeyDeps, additionalKeys }: StoreBuilderParam<T, Deps>) {
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
    this.additionalKeys = additionalKeys ?? [];
  }

  public define(defineFn: DefineStore<T, Deps>) {
    this.defineStore = defineFn;
    return wrapStore(
      new StoreBaseImpl<T, Deps>({
        defineStore: this.defineStore,
        getKeyDeps: this.getKeyDeps,
        additionalKeys: this.additionalKeys,
      }),
    );
  }

  public key(getFn: GetKeyDeps<Deps>) {
    return new StoreBuilderImpl<T, Deps>({
      getKeyDeps: getFn,
      additionalKeys: this.additionalKeys,
    });
  }

  public local() {
    return new StoreBuilderImpl<T, Deps>({
      getKeyDeps: this.getKeyDeps,
      additionalKeys: [...this.additionalKeys, KeyHelper.random()],
    });
  }
}

export { StoreBuilderImpl };
