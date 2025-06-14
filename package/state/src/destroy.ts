import { decompose, getComposition, isComposedElsewhere } from "./compose";
import { HashedKey } from "./key";
import { InternalState } from "./state";
import { deleteStore, isStoredLeft } from "./store";
import { isSubscriptionsLeft } from "./subscribe";

interface Destroy {
  key: HashedKey;
  state: InternalState<unknown>;
}

const destroyQueue: Destroy[] = [];
const abortedDestroyKeys = new Set<HashedKey>();
let destroyTimeout: NodeJS.Timeout | undefined = undefined;

const destroyStateIfClean = (state: InternalState<unknown>) => {
  if (isComposedElsewhere(state.key)) return;
  if (isSubscriptionsLeft(state.key)) return;
  state.storeRef.delete(state.key);
  if (!isStoredLeft(state.storeRef.key)) {
    deleteStore(state.storeRef.key);
  }
};

const executeDestroy = () => {
  destroyQueue.forEach(({ state }) => {
    const composition = getComposition(state.key);
    if (composition) {
      decompose(state);
      composition.composes.forEach(destroyStateIfClean);
    }
    destroyStateIfClean(state);
  });

  destroyQueue.splice(0, destroyQueue.length);
  abortedDestroyKeys.clear();
  destroyTimeout = undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const destroy = (state: InternalState<any>) => {
  destroyQueue.push({
    key: state.key,
    state,
  });
  destroyTimeout ??= setTimeout(executeDestroy);
};

const abortDestroy = (key: HashedKey) => {
  abortedDestroyKeys.add(key);
};

export { abortDestroy, destroy };
