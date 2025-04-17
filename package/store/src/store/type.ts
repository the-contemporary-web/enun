import { StoreApi } from "zustand";

import { RawKey } from "../cache";
import { StoreImpl } from "./StoreImpl";

interface DefineStoreParam<T extends object, Deps extends object, Composed extends ComposeMap> {
  injected: Deps;
  composed: Composed;
  set: Setter<T>;
}
interface DefineStore<T extends object, Deps extends object, Composed extends ComposeMap> {
  (param: DefineStoreParam<T, Deps, Composed>): T;
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

type ComposeMap = Record<string, StoreImpl<object>>;
type Composer<Deps, Composed extends ComposeMap> = (store: Deps) => Composed;

/**
 * External
 */
type ZustandStore<T> = StoreApi<T>;

export type { ComposeMap, Composer, DefineStore, DefineStoreParam, GetKeyDeps, Setter, Subscriber, ZustandStore };
