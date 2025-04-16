import { StoreApi } from "zustand";

import { RawKey } from "../cache";

interface DefineStoreParam<T extends object, Deps extends object> {
  injected: Deps;
  set: Setter<T>;
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
interface Subscriber<T> {
  (state: T, prevState: T): void;
}

/**
 * External
 */
type ZustandStore<T> = StoreApi<T>;

export type { DefineStore, DefineStoreParam, GetKeyDeps, Setter, Subscriber, ZustandStore };
