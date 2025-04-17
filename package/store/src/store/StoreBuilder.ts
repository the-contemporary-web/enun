import { Store } from "./Store";
import { ComposeMap, Composer, DefineStore, GetKeyDeps } from "./type";

interface StoreBuilderParam<T extends object, Deps extends object, Composed extends ComposeMap> {
  defineStore?: DefineStore<T, Deps, Composed>;
  getKeyDeps?: GetKeyDeps<Deps>;
  composeStore?: Composer<Deps, Composed>;
}

class StoreBuilder<T extends object, Deps extends object, Composed extends ComposeMap> {
  private defineStore?: DefineStore<T, Deps, Composed>;
  private getKeyDeps?: GetKeyDeps<Deps>;
  private composeStore?: Composer<Deps, Composed>;

  constructor({ defineStore, getKeyDeps, composeStore }: StoreBuilderParam<T, Deps, Composed>) {
    this.defineStore = defineStore;
    this.getKeyDeps = getKeyDeps;
    this.composeStore = composeStore;
  }

  public define(defineFn: DefineStore<T, Deps, Composed>) {
    this.defineStore = defineFn;
    return new Store<T, Deps, Composed>({
      defineStore: this.defineStore,
      getKeyDeps: this.getKeyDeps,
      composeStore: this.composeStore,
    });
  }

  public key(getFn: GetKeyDeps<Deps>) {
    return new StoreBuilder<T, Deps, Composed>({
      getKeyDeps: getFn,
      composeStore: this.composeStore,
    });
  }

  public compose<C extends ComposeMap>(composer: Composer<Deps, C>) {
    return new StoreBuilder<T, Deps, C>({
      getKeyDeps: this.getKeyDeps,
      composeStore: composer,
    });
  }
}

export { StoreBuilder };
