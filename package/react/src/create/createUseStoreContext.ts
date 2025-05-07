import { Store } from "@enun/store";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";

const createUseStoreContext = <T extends object, Deps extends object>(store: Store<T, Deps>) => {
  const useStoreContext = (deps: Deps) => {
    const storeImpl = useMemo(() => {
      return store.use(deps);
    }, [store.hashKey(deps)]);

    const storeUsed = useStore(storeImpl.zustandStore);

    useEffect(() => {
      const cleanupFunction = storeImpl.destroy.bind(storeImpl); // FIXME: `this` binding problem
      return () => {
        cleanupFunction();
      };
    }, [storeImpl]);

    return [storeImpl, storeUsed] as const;
  };

  return useStoreContext;
};

export { createUseStoreContext };
