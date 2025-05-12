import { create, RawKey } from "@enun/store";

const VIEW_STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
} as const;
type VIEW_STATUS = typeof VIEW_STATUS;

interface ViewStatePending<T> {
  status: VIEW_STATUS["PENDING"];
  view: null;
  promise: Promise<T>;
  loading: true;
  error: null;
}
interface ViewStateFulfilled<T> {
  status: VIEW_STATUS["FULFILLED"];
  view: T;
  promise: null;
  loading: boolean;
  error: null;
}
interface ViewStateRejected {
  status: VIEW_STATUS["REJECTED"];
  view: null;
  promise: null;
  loading: false;
  error: Error;
}

type ViewState<T> = ViewStatePending<T> | ViewStateFulfilled<T> | ViewStateRejected;
type ViewStore<T> = ViewState<T> & {
  invalidate: () => Promise<T>;
};

type CreateViewStoreParam<T, Deps extends object> = {
  key: (deps: Deps) => RawKey;
  from: (deps: Deps) => Promise<T>;
};

const createViewStore = <T, Deps extends object>({ key, from }: CreateViewStoreParam<T, Deps>) => {
  const store = create<ViewStore<T>, Deps>()
    .key(key)
    .define(({ injected, set }) => {
      const promise = from(injected);
      void promise
        .then(view => {
          set({
            status: VIEW_STATUS.FULFILLED,
            view,
            promise: null,
            loading: false,
            error: null,
          });
        })
        .catch((error: unknown) => {
          set({
            status: VIEW_STATUS.REJECTED,
            view: null,
            promise: null,
            loading: false,
            error: error as Error,
          });
        });

      const invalidate = () => {
        const promiseToReturn = new Promise<T>((resolve, reject) => {
          set(prev => {
            if (prev.loading) return {};
            const newPromise = from(injected)
              .then(view => {
                set({
                  status: VIEW_STATUS.FULFILLED,
                  view,
                  promise: null,
                  loading: false,
                  error: null,
                });
                resolve(view);
                return view;
              })
              .catch((error: unknown) => {
                const errorToReturn = error as Error;
                set({
                  status: VIEW_STATUS.REJECTED,
                  view: null,
                  promise: null,
                  loading: false,
                  error: errorToReturn,
                });
                reject(errorToReturn);
                throw errorToReturn;
              });

            return {
              promise: newPromise,
              loading: true,
              error: null,
            };
          });
        });
        return promiseToReturn;
      };

      return {
        status: VIEW_STATUS.PENDING,
        view: null,
        promise,
        loading: true,
        error: null,
        invalidate,
      };
    });
  return store;
};

export { createViewStore, VIEW_STATUS };
export type { ViewStore };
