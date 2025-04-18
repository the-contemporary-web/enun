import { ComposeMap, Store, StoreImpl } from "@enun/store";
import { useStore as useZustandStore } from "zustand";

import { useStoreFromContext } from "./context/StoreContext";

const createHook = <T extends object, Deps extends object, Composed extends ComposeMap>(
  store: Store<T, Deps, Composed>,
) => {
  const useStore = (props?: Deps) => {
    const fromContext = useStoreFromContext<T>({ fingerPrint: store.fingerPrint });
    let impl: StoreImpl<T>;
    if (props) {
      impl = store.use(props);
    } else {
      if (!fromContext) throw new Error("No store matching");
      impl = fromContext;
    }
    return useZustandStore(impl.zustandStore);
  };
  return useStore;
};

export { createHook };
