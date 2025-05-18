import { Storable, StoreApi } from "@enun/store";
import { createContext, useContext } from "react";

type StoreMap = Record<string, StoreApi<Storable>>;
type StoreContext = {
  storeMap: StoreMap;
};
const StoreContext = createContext<StoreContext>({
  storeMap: {},
});

type UseStoreFromContextParam = {
  fingerPrint: string;
};
const useStoreFromContext = <T extends Storable>({ fingerPrint }: UseStoreFromContextParam) => {
  const { storeMap } = useContext(StoreContext);
  const store = storeMap[fingerPrint] as StoreApi<T> | undefined;
  return store;
};

export { StoreContext, useStoreFromContext };
export type { StoreMap };
