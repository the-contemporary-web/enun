import { create, RawKey } from "@enun/store";

const INTENT_STATUS = {
  BUSY: "BUSY",
  IDLE: "IDLE",
} as const;
type INTENT_STATUS = typeof INTENT_STATUS;

interface IntentStoreBusy<O> {
  status: INTENT_STATUS["BUSY"];
  promise: Promise<O>;
  isBusy: true;
}

interface IntentStoreIdle {
  status: INTENT_STATUS["IDLE"];
  promise: null;
  isBusy: false;
}

type IntentState<O> = IntentStoreBusy<O> | IntentStoreIdle;
type IntentStore<O, I extends unknown[]> = IntentState<O> & {
  execute: (...args: I) => Promise<O>;
};

type IntentConfig = {
  retryBusyRequest?: boolean;
};
const DEFAULT_CONFIG: IntentConfig = {
  retryBusyRequest: false,
};

type CreateIntentStoreParam<O, I extends unknown[], Deps extends object = object> = {
  key: (deps: Deps) => RawKey;
  to: (deps: Deps, ...args: I) => Promise<O>;
  next?: (deps: Deps, output: O, ...args: I) => void;
  config?: Partial<IntentConfig>;
};

const createIntentStore = <O, I extends unknown[], Deps extends object = object>({
  key,
  to,
  next,
  config: _config,
}: CreateIntentStoreParam<O, I, Deps>) => {
  const config: IntentConfig = {
    ...DEFAULT_CONFIG,
    ..._config,
  };

  const store = create<IntentStore<O, I>, Deps>()
    .key(key)
    .define(({ injected, set }) => {
      let retryRequest: (() => Promise<O>) | undefined = undefined;
      const execute = (...args: I) => {
        const promiseToReturn = new Promise<O>((resolve, reject) => {
          set(prev => {
            if (prev.isBusy) {
              if (config.retryBusyRequest) {
                retryRequest = () => execute(...args);
              }
              return prev;
            }
            const promise = to(injected, ...args)
              .then(output => {
                next?.(injected, output, ...args);
                resolve(output);
                return output;
              })
              .catch((error: unknown) => {
                reject(error as Error);
                throw error;
              })
              .finally(() => {
                if (retryRequest) {
                  void retryRequest();
                  retryRequest = undefined;
                }
                set({
                  status: INTENT_STATUS.IDLE,
                  promise: null,
                  isBusy: false,
                });
              });

            return {
              promise,
              isBusy: true,
              status: INTENT_STATUS.BUSY,
            };
          });
        });
        return promiseToReturn;
      };

      return {
        status: INTENT_STATUS.IDLE,
        promise: null,
        isBusy: false,
        execute,
      };
    });

  return store;
};

export { createIntentStore };
