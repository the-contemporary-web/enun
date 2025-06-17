import { createStore } from "@enun/store";

import { AnyInternalState } from "./any";
import { HashedKey } from "./key";
import { InternalState } from "./state";

interface Composition {
  key: HashedKey;
  composes: AnyInternalState[];
  unsubscribers: (() => void)[];
}
interface Tracker {
  key: HashedKey;
  composedBy: HashedKey[];
}

const compositions = createStore<HashedKey, Composition>({
  init: () => ({
    key: "",
    composes: [],
    unsubscribers: [],
  }),
  shouldDelete: composition => {
    return composition.composes.length === 0 && composition.unsubscribers.length === 0;
  },
});
const trackers = createStore<HashedKey, Tracker>({
  init: () => ({
    key: "",
    composedBy: [],
  }),
  shouldDelete: tracker => {
    return tracker.composedBy.length === 0;
  },
});

const compose = <Value>(key: HashedKey, state: InternalState<Value>) => {
  const composition = compositions.safeGet(key);
  composition.composes.push(state);

  const tracker = trackers.safeGet(state.key);
  tracker.composedBy.push(key);

  state.compositionRef = composition;
  return composition;
};

const decompose = (state: InternalState<unknown>) => {
  const composition = compositions.get(state.key);
  if (composition) {
    composition.composes.forEach(composed => {
      const tracker = trackers.get(composed.key);
      if (tracker) {
        tracker.composedBy.splice(tracker.composedBy.indexOf(state.key), 1);
        trackers.clean(composed.key);
      }
    });
    compositions.delete(state.key);
  }
};

const getComposition = (key: HashedKey) => {
  return compositions.get(key);
};

const isComposedElsewhere = (key: HashedKey) => {
  return trackers.alive(key);
};

export { compose, decompose, getComposition, isComposedElsewhere };
export type { Composition, Tracker };
