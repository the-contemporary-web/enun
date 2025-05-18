import { globalCacheManager, HashedKey } from "../cache";
import { ExternalStore, Getter, Setter, Storable, StoreApi, Subscriber } from "../type";

interface StoreApiImplParam<T extends Storable> {
  fingerPrint: string;
  key: HashedKey;
  store: ExternalStore<T>;
  onDestroy: () => void;
}

class StoreApiImpl<T extends Storable> implements StoreApi<T> {
  private onDestroy: () => void;
  public fingerPrint: string;
  public key: HashedKey;
  public store: ExternalStore<T>;
  public get: Getter<T>;
  public set: Setter<T>;
  public subscribe: Subscriber<T>;
  public getInitial: Getter<T>;

  constructor({ key, fingerPrint, store, onDestroy }: StoreApiImplParam<T>) {
    this.fingerPrint = fingerPrint;
    this.key = key;
    this.store = store;
    this.onDestroy = onDestroy;
    this.get = store.getState;
    this.set = store.setState;
    this.subscribe = store.subscribe;
    this.getInitial = store.getInitialState;
  }

  public destroy() {
    this.onDestroy();
    globalCacheManager.release({ key: this.key });
  }
}

export { StoreApiImpl };

