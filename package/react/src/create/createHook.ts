import { Store } from "@enun/store";

import { createUseStoreContext } from "./createUseStoreContext";
import { createUseStoreInterface } from "./createUseStoreInterface";

const createHook = <T extends object, Deps extends object>(store: Store<T, Deps>) => {
  const useStoreContext = createUseStoreContext(store);
  const useStoreInterface = createUseStoreInterface(store);

  return [useStoreInterface, useStoreContext] as const;
};

export { createHook };
