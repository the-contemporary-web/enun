import { StoreApi } from "zustand";

import { RawKey } from "../cache";

interface Destroyable {
  destroy: () => void;
}

interface DefineStoreParam<T extends object, Deps extends object> {
  injected: Deps;
  set: Setter<T>;
  compose: Composer;
}
interface DefineStore<T extends object, Deps extends object> {
  (param: DefineStoreParam<T, Deps>): T;
}
interface GetKeyDeps<Deps extends object> {
  (prev: Deps): RawKey;
}

interface Setter<T> {
  (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false): void;
  (state: T | ((state: T) => T), replace: true): void;
}
interface Composer {
  <T extends Destroyable>(destroyable: T): T;
}
interface Subscriber<T> {
  (state: T, prevState: T): void;
}

/**
 * External
 */
type ZustandStore<T> = StoreApi<T>;

export type { Composer, DefineStore, DefineStoreParam, Destroyable, GetKeyDeps, Setter, Subscriber, ZustandStore };
