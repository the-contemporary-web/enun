import { HashedKey } from "./key";
import { assureState, InternalState } from "./state";

const subscriptions = new Map<HashedKey, Set<() => void>>();

const subscribe = <Value, Action = unknown>(state: InternalState<Value, Action>, callback: () => void) => {
  const cb = callback;
  const currentState = assureState(state.key, state.storeRef);
  const existingSubscription = subscriptions.get(currentState.key);

  if (existingSubscription) {
    existingSubscription.add(cb);
  } else {
    subscriptions.set(currentState.key, new Set([cb]));
  }

  // returns true if there's no more subscriptions left
  return () => {
    const existingSubscription = subscriptions.get(currentState.key);
    if (existingSubscription) {
      existingSubscription.delete(cb);
      if (existingSubscription.size === 0) {
        subscriptions.delete(currentState.key);
        return true;
      }
    }
    return true;
  };
};

const notify = (key: HashedKey) => {
  const existingSubscription = subscriptions.get(key);
  if (existingSubscription) {
    existingSubscription.forEach(cb => {
      cb();
    });
  }
};

const getSubscriptions = () => {
  return subscriptions;
};

export { getSubscriptions, notify, subscribe };
