import { Composed, Storable, StoreApi } from "@enun/store";
import { PropsWithChildren, useContext, useMemo } from "react";

import { StoreContext, StoreMap } from "./StoreContext";

interface StoreProviderProps extends PropsWithChildren {
  store?: StoreApi<Storable>[];
  composed?: Composed<Storable>[];
}

const StoreProvider = ({ children, store = [], composed = [] }: StoreProviderProps) => {
  const { storeMap } = useContext(StoreContext);
  const newStoreMap = useMemo(() => {
    return {
      ...storeToStoreMap(store),
      ...composedToStoreMap(composed),
    };
  }, [...store.map(s => s.key), ...composed.map(([s]) => s.key)]);
  return <StoreContext value={{ storeMap: { ...storeMap, ...newStoreMap } }}>{children}</StoreContext>;
};

const storeToStoreMap = (stores: StoreApi<object>[]): StoreMap =>
  Object.fromEntries(stores.map(store => [store.fingerPrint, store]));

const composedToStoreMap = (composed: Composed<Storable>[]): StoreMap =>
  Object.fromEntries(composed.map(([api]) => [api.fingerPrint, api]));

export { StoreProvider };
