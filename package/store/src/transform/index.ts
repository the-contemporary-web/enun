import { StoreApi } from "../type";
import { ExternalStore } from "../type";
import { Storable } from "../type";

const transformStoreApiToExternalStore = <T extends Storable>(storeApi: StoreApi<T>): ExternalStore<T> => {
  return {
    getState: storeApi.get,
    setState: storeApi.set,
    subscribe: storeApi.subscribe,
    getInitialState: storeApi.getInitial,
  };
};

export { transformStoreApiToExternalStore };
