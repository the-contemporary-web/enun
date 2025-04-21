import { globalCacheManager, HashedKey } from "../cache";
import { Subscriber, ZustandStore } from "./type";

interface StoreImplParam<T extends object> {
  fingerPrint: string;
  key: HashedKey;
  store: ZustandStore<T>;
  onDestroy: () => void;
}
class StoreImpl<T extends object> {
  private onDestroy: () => void;
  public fingerPrint: string;
  public key: HashedKey;
  public zustandStore: ZustandStore<T>;

  constructor({ key, fingerPrint, store, onDestroy }: StoreImplParam<T>) {
    this.fingerPrint = fingerPrint;
    this.key = key;
    this.zustandStore = store;
    this.onDestroy = onDestroy;
  }

  public get() {
    return this.zustandStore.getState();
  }

  public subscribe(subscriber: Subscriber<T>) {
    this.zustandStore.subscribe(subscriber);
  }

  public destroy() {
    this.onDestroy();
    globalCacheManager.release({ key: this.key });
  }
}

export { StoreImpl };
