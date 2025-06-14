import { HashedKey } from "./key";
import { InternalState } from "./state";

interface Composition {
  key: HashedKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  composes: InternalState<any>[];
  unsubscribers: (() => void)[];
}
interface Tracker {
  key: HashedKey;
  composedBy: HashedKey[];
}

const compositions = new Map<HashedKey, Composition>();
const trackers = new Map<HashedKey, Tracker>();

const createComposition = (key: HashedKey) => {
  const newComposition = {
    key,
    composes: [],
    unsubscribers: [],
  };
  compositions.set(key, newComposition);
  return newComposition;
};
const createTracker = (key: HashedKey) => {
  const newTracker = {
    key,
    composedBy: [],
  };
  trackers.set(key, newTracker);
  return newTracker;
};

const compose = <Value>(key: HashedKey, state: InternalState<Value>) => {
  const composition = compositions.get(key) ?? createComposition(key);
  composition.composes.push(state);

  const tracker = trackers.get(state.key) ?? createTracker(state.key);
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
        if (tracker.composedBy.length === 0) {
          trackers.delete(composed.key);
        }
      }
    });
    compositions.delete(state.key);
  }
};

const getComposition = (key: HashedKey) => {
  return compositions.get(key);
};

const isComposedElsewhere = (key: HashedKey) => {
  const tracker = trackers.get(key);
  if (!tracker) {
    return false;
  }
  return tracker.composedBy.length > 0;
};

export { compose, decompose, getComposition, isComposedElsewhere };
export type { Composition, Tracker };
