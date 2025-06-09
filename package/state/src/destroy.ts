import { HashedKey } from "./key";
import { InternalState } from "./state";

const destroyMap = new Map<HashedKey, () => void>();
const abortedDestroyKeys = new Set<HashedKey>();
let destroyTimeout: NodeJS.Timeout | undefined = undefined;

const destroy = <Value, Action = unknown>(state: InternalState<Value, Action>) => {
  destroyMap.set(state.key, () => {
    state.storeRef.delete(state.key);
  });
  destroyTimeout ??= setTimeout(executeDestroy);
};

const abortDestroy = (key: HashedKey) => {
  abortedDestroyKeys.add(key);
};

const executeDestroy = () => {
  destroyMap.forEach((destroy, key) => {
    if (abortedDestroyKeys.has(key)) {
      return;
    }
    destroy();
  });
  destroyMap.clear();
  abortedDestroyKeys.clear();
  destroyTimeout = undefined;
};

export { abortDestroy, destroy };
