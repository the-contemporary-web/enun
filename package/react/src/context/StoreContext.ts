import { StoreImpl } from "@enun/store";
import { createContext, useContext } from "react";

type StoreMap = Record<string, StoreImpl<object>>;
type StoreContext = {
  storeMap: StoreMap;
};
const StoreContext = createContext<StoreContext>({
  storeMap: {},
});

type UseStoreFromContextParam = {
  fingerPrint: string;
};
const useStoreFromContext = <T extends object>({ fingerPrint }: UseStoreFromContextParam) => {
  const { storeMap } = useContext(StoreContext);
  const store = storeMap[fingerPrint] as StoreImpl<T> | undefined;
  return store;
};

export { StoreContext, useStoreFromContext };
export type { StoreMap };
