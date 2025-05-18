import { Dependencies, Storable, Store, StoreApi, transformStoreApiToExternalStore } from "@enun/store";
import { useEffect, useMemo, useRef } from "react";
import { useStore as useZustandStore } from "zustand";

import { useStoreFromContext } from "../context";

const isDepsEmpty = <Deps extends Dependencies>(deps: Deps | []): deps is [] => {
  return deps.length === 0;
};

const createUseStore = <T extends Storable, Deps extends Dependencies>(store: Store<T, Deps>) => {
  const useStoreInterface = (...deps: Deps | []) => {
    const needCleanup = useRef(false);
    const storeFromContext = useStoreFromContext<T>({ fingerPrint: store.fingerPrint });

    const storeApi = useMemo(() => {
      let api: StoreApi<T>;
      if (!isDepsEmpty(deps)) {
        api = store(...deps);
        needCleanup.current = true;
      } else {
        if (!storeFromContext) throw new Error("No store matching");
        api = storeFromContext;
        needCleanup.current = false;
      }
      return api;
    }, [!isDepsEmpty(deps) ? store.hashKey(...deps) : storeFromContext]);

    useEffect(() => {
      const cleanupFunction = needCleanup.current ? storeApi.destroy.bind(storeApi) : undefined;
      return () => {
        cleanupFunction?.();
      };
    }, [storeApi]);

    return useZustandStore(transformStoreApiToExternalStore(storeApi));
  };

  return useStoreInterface;
};

export { createUseStore, isDepsEmpty };
