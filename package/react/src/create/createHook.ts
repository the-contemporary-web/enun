import { Dependencies, Storable, Store } from "@enun/store";

import { createUseStoreApi } from "./createUseStoreApi";
import { createUseStore } from "./createUseStore";

const createHook = <T extends Storable, Deps extends Dependencies>(store: Store<T, Deps>) => {
  const useStore = createUseStore(store);
  const useStoreContext = createUseStoreApi(store);

  return [useStore, useStoreContext] as const;
};

export { createHook };
