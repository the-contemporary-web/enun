import { Storable, Store, transformStoreApiToExternalStore } from "@enun/store";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { Dependencies } from "../../../store";

const createUseStoreApi = <T extends Storable, Deps extends Dependencies>(store: Store<T, Deps>) => {
  const useStoreApi = (...deps: Deps) => {
    const storeImpl = useMemo(() => {
      return store(...deps);
    }, [store.hashKey(...deps)]);

    const storeUsed = useStore(transformStoreApiToExternalStore(storeImpl));

    useEffect(() => {
      const cleanupFunction = storeImpl.destroy.bind(storeImpl); // FIXME: `this` binding problem
      return () => {
        cleanupFunction();
      };
    }, [storeImpl]);

    return [storeImpl, storeUsed] as const;
  };

  return useStoreApi;
};

export { createUseStoreApi };
