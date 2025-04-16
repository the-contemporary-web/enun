import { globalCacheManager, HashedKey } from "../cache";
import { Subscriber, ZustandStore } from "./type";

interface StoreImplParam<T extends object> {
  key: HashedKey;
  store: ZustandStore<T>;
}
class StoreImpl<T extends object> {
  public key: HashedKey;
  public zustandStore: ZustandStore<T>;

  constructor({ key, store }: StoreImplParam<T>) {
    this.key = key;
    this.zustandStore = store;
  }

  public get() {
    return this.zustandStore.getState();
  }

  public subscribe(subscriber: Subscriber<T>) {
    this.zustandStore.subscribe(subscriber);
  }

  public destroy() {
    globalCacheManager.release({ key: this.key });
  }
}

export { StoreImpl };
