import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import { create, globalCacheManager, StoreApi } from "./index";

/**
 * Zustand Test
 */

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const bearStore = createStore<BearState>()(set => ({
  bears: 0,
  increase: by => {
    set(state => ({ bears: state.bears + by }));
  },
}));

function useBearStore(): BearState;
function useBearStore<T>(selector: (state: BearState) => T): T;
function useBearStore<T>(selector?: (state: BearState) => T) {
  const selectorAsserted = selector ?? ((state: BearState) => state as T);
  return useStore(bearStore, selectorAsserted);
}
console.log(useBearStore);

/**
 * Basic Store Test
 */

interface TextStore {
  text: string;
  write: (text: string) => void;
  clear: () => void;
}

const TextStore = create<TextStore, [{ text: string }]>().define(({ set }, { text }) => {
  const write = (text: string) => {
    set({ text });
  };
  const clear = () => {
    set({ text: "" });
  };

  return {
    text,
    write,
    clear,
  };
});

const globalTextStore = TextStore({ text: "This is global!" });
const globalTextStore2 = TextStore({ text: "This must be global too!" });
const localTextStore = TextStore.local()({ text: "This is local!" });

const inspect = () => {
  console.log("global1:", globalTextStore.get().text);
  console.log("global2:", globalTextStore2.get().text);
  console.log("local:", localTextStore.get().text);
};

inspect();

console.log("write global");
globalTextStore.get().write("Global Store modified");

inspect();

/**
 * GC Test
 */
const inspectCacheMap = () => {
  console.log(Array.from(globalCacheManager.cacheMap.entries()));
  console.log("cache:", globalCacheManager.cacheMap.size);
  console.log("count:", globalCacheManager.countMap.size);
};

inspectCacheMap();
globalTextStore.destroy();

setTimeout(() => {
  inspectCacheMap();
  globalTextStore2.destroy();
  setTimeout(() => {
    inspectCacheMap();
    localTextStore.destroy();
    setTimeout(() => {
      inspectCacheMap();
    }, 1000);
  }, 1000);
}, 1000);

/**
 * Compose Text
 */

interface TextWithCountStore {
  textStore: StoreApi<TextStore>;
  count: number;
}

const TextWithCountStore = create<TextWithCountStore, [{ text: string }]>().define(({ compose, set }, { text }) => {
  const [textStore] = compose(TextStore.local()({ text }));
  textStore.subscribe(({ text }) => {
    set({
      count: text.length,
    });
  });

  return {
    textStore,
    count: text.length,
  };
});

const globalTextWithCountStore = TextWithCountStore({ text: "" });

const inspectCount = () => {
  console.log("text:", globalTextWithCountStore.get().textStore.get().text);
  console.log("count:", globalTextWithCountStore.get().count);
};

inspectCount();
globalTextWithCountStore.get().textStore.get().write("hello, world");
inspectCount();
inspectCacheMap();
globalTextWithCountStore.destroy();
inspectCacheMap();
