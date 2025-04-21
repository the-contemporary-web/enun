import { ComposeMap, Store } from "@enun/store";
import { useEffect, useMemo } from "react";

export const useStoreInit = <T extends object, Deps extends object, Composed extends ComposeMap>(
  store: Store<T, Deps, Composed>,
  deps: Deps,
) => {
  const storeImpl = useMemo(() => {
    return store.use(deps);
  }, [store.hashKey(deps)]);

  useEffect(() => {
    const cleanupFunction = storeImpl.destroy.bind(storeImpl); // FIXME: `this` binding problem
    return () => {
      cleanupFunction();
    };
  }, [storeImpl]);

  return storeImpl;
};
