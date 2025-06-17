import { AnyInternalState } from "./any";
import { decompose, getComposition, isComposedElsewhere } from "./compose";
import { HashedKey } from "./key";
import { InternalState } from "./state";
import { deleteStateStore, isStatesLeft } from "./store";
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
  if (!isStatesLeft(state.storeRef.key)) {
    deleteStateStore(state.storeRef.key);
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

const destroy = (state: AnyInternalState) => {
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
