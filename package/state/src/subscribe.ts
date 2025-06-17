import { createStore } from "@enun/store";

import { HashedKey } from "./key";
import { assureState, InternalState } from "./state";

interface Subscription {
  key: HashedKey;
  subscribers: Set<() => void>;
}
const subscriptions = createStore<HashedKey, Subscription>({
  shouldDelete: ({ subscribers }) => subscribers.size < 1,
});

const createSubscription = (key: HashedKey) => {
  const newSubscription: Subscription = {
    key,
    subscribers: new Set(),
  };
  subscriptions.set(key, newSubscription);
  return newSubscription;
};
const subscribe = <Value>(state: InternalState<Value>, callback: () => void) => {
  const cb = callback;
  const currentState = assureState(state.key, state.storeRef);
  const subscription = subscriptions.get(currentState.key) ?? createSubscription(currentState.key);

  subscription.subscribers.add(cb);

  const unsubscribe = () => {
    subscription.subscribers.delete(cb);
    subscriptions.clean(currentState.key);
  };

  if (state.compositionRef) {
    state.compositionRef.unsubscribers.push(unsubscribe);
  }

  return unsubscribe;
};

const notify = (key: HashedKey) => {
  const existingSubscription = subscriptions.get(key);
  if (existingSubscription) {
    existingSubscription.subscribers.forEach(cb => {
      cb();
    });
  }
};

const isSubscriptionsLeft = (key: HashedKey) => {
  return subscriptions.alive(key);
};

const getSubscriptions = () => {
  return subscriptions;
};

export { getSubscriptions, isSubscriptionsLeft, notify, subscribe };
