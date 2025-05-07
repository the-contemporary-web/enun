import { Store, StoreImpl } from "@enun/store";
import { useEffect, useMemo, useRef } from "react";
import { useStore as useZustandStore } from "zustand";

import { useStoreFromContext } from "../context";

const createUseStoreInterface = <T extends object, Deps extends object>(store: Store<T, Deps>) => {
  const useStoreInterface = (deps?: Deps) => {
    const needCleanup = useRef(false);
    const storeFromContext = useStoreFromContext<T>({ fingerPrint: store.fingerPrint });

    const storeImpl = useMemo(() => {
      let impl: StoreImpl<T>;
      if (deps) {
        impl = store.use(deps);
        needCleanup.current = true;
      } else {
        if (!storeFromContext) throw new Error("No store matching");
        impl = storeFromContext;
        needCleanup.current = false;
      }
      return impl;
    }, [deps ? store.hashKey(deps) : storeFromContext]);

    useEffect(() => {
      const cleanupFunction = needCleanup.current ? storeImpl.destroy.bind(storeImpl) : undefined;
      return () => {
        cleanupFunction?.();
      };
    }, [storeImpl]);

    return useZustandStore(storeImpl.zustandStore);
  };

  return useStoreInterface;
};

export { createUseStoreInterface };
