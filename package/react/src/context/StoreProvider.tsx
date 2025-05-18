import { StoreApi } from "@enun/store";
import { PropsWithChildren, useContext, useMemo } from "react";

import { StoreContext, StoreMap } from "./StoreContext";

interface StoreProviderProps extends PropsWithChildren {
  store: StoreApi<object>[];
}

const StoreProvider = ({ children, store }: StoreProviderProps) => {
  const { storeMap } = useContext(StoreContext);
  const newStoreMap = useMemo(
    () => toStoreMap(store),
    store.map(s => s.key),
  );
  return <StoreContext value={{ storeMap: { ...storeMap, ...newStoreMap } }}>{children}</StoreContext>;
};

const toStoreMap = (stores: StoreApi<object>[]): StoreMap =>
  Object.fromEntries(stores.map(store => [store.fingerPrint, store]));

export { StoreProvider };
