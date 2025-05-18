import { StoreApi as ZustandStoreApi } from "zustand";

import { HashedKey, RawKey } from "../cache";
/**
 * External
 */
type ExternalStore<T> = ZustandStoreApi<T>;

/**
 * Core
 */

type StoreKey = HashedKey;
type Storable = object;
type Dependencies = unknown[];

type Getter<T extends Storable> = ExternalStore<T>["getState"];
type Setter<T extends Storable> = ExternalStore<T>["setState"];
type Subscriber<T extends Storable> = ExternalStore<T>["subscribe"];
type Destroyer = () => void;

type Composed<T extends Storable> = [StoreApi<T>, T];
interface Composer {
  <T extends Storable>(composable: StoreApi<T>): Composed<T>;
}
interface Decomposer {
  <T extends Storable>(composable: StoreApi<T>): void;
}

/**
 * Store Builder
 */
interface DefineStoreParam<T extends Storable> {
  get: Getter<T>;
  set: Setter<T>;
  compose: Composer;
  decompose: Decomposer;
}
interface DefineStore<T extends Storable, Deps extends Dependencies> {
  (param: DefineStoreParam<T>, ...deps: Deps): T;
}

interface GetKeyDeps<Deps extends Dependencies> {
  (...prev: Deps): RawKey;
}

interface StoreBuilder<T extends Storable, Deps extends Dependencies> {
  define(defineFn: DefineStore<T, Deps>): Store<T, Deps>;
  key(getFn: GetKeyDeps<Deps>): StoreBuilder<T, Deps>;
  local(): StoreBuilder<T, Deps>;
}

/**
 * Store
 */

interface StoreBase<T extends Storable, Deps extends Dependencies> {
  readonly fingerPrint: string;
  additionalKeys: RawKey[];
  api(...deps: Deps): StoreApi<T>;
  hashKey(...deps: Deps): StoreKey;
  appendKey(...keysToAppend: RawKey[]): StoreBase<T, Deps>;
  local(): StoreBase<T, Deps>;
  forEach(callbackFn: (storeApi: StoreApi<T>) => void): void;
}

interface Store<T extends Storable, Deps extends Dependencies> {
  readonly fingerPrint: string;
  (...deps: Deps): StoreApi<T>;
  (deps: Deps): StoreApi<T>;
  hashKey(...deps: Deps): HashedKey;
  appendKey(...keysToAppend: RawKey[]): Store<T, Deps>;

  local(): Store<T, Deps>;
  forEach(callbackFn: (storeApi: StoreApi<T>) => void): void;
}

/**
 * StoreApi
 */
interface StoreApi<T extends Storable> {
  readonly fingerPrint: string;
  readonly key: StoreKey;
  get: Getter<T>;
  set: Setter<T>;
  subscribe: Subscriber<T>;
  getInitial: Getter<T>;
  destroy: Destroyer;
}

export type {
  Composed,
  Composer,
  Decomposer,
  DefineStore,
  Dependencies,
  Destroyer,
  ExternalStore,
  GetKeyDeps,
  Getter,
  Setter,
  Storable,
  Store,
  StoreApi,
  StoreBase,
  StoreBuilder,
  StoreKey,
  Subscriber,
};
