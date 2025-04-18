import { StoreImpl } from "@enun/store";
import { PropsWithChildren, useContext, useEffect, useMemo } from "react";

import { StoreContext, StoreMap } from "./StoreContext";

interface StoreProviderProps extends PropsWithChildren {
  store: StoreImpl<object>[];
}

const StoreProvider = ({ children, store }: StoreProviderProps) => {
  const { storeMap } = useContext(StoreContext);
  const newStoreMap = useMemo(
    () => toStoreMap(store),
    store.map(s => s.key),
  );

  useEffect(() => {}, []);

  return <StoreContext value={{ storeMap: { ...storeMap, ...newStoreMap } }}>{children}</StoreContext>;
};

const toStoreMap = (stores: StoreImpl<object>[]): StoreMap =>
  Object.fromEntries(stores.map(store => [store.fingerPrint, store]));

export { StoreProvider };
