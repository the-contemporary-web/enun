import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import { create, globalCacheManager } from "./index";

/**
 * Zustand Test
 */

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const bearStore = createStore<BearState>()(set => ({
  bears: 0,
  increase: by => set(state => ({ bears: state.bears + by })),
}));

function useBearStore(): BearState;
function useBearStore<T>(selector: (state: BearState) => T): T;
function useBearStore<T>(selector?: (state: BearState) => T) {
  return useStore(bearStore, selector!);
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

const TextStore = create<TextStore, { text: string }>().define(({ injected, set }) => {
  const write = (text: string) => set({ text });
  const clear = () => set({ text: "" });

  return {
    text: injected.text,
    write,
    clear,
  };
});

const globalTextStore = TextStore.use({ text: "This is global!" });
const globalTextStore2 = TextStore.use({ text: "This must be global too!" });
const localTextStore = TextStore.appendKey("local").use({ text: "This is local!" });

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
  console.log("cache:", globalCacheManager.cacheMap.size);
  console.log("count:", globalCacheManager.countMap.size);
};

inspectCacheMap();
globalTextStore.destroy();

setTimeout(() => {
  inspectCacheMap(); // expect 2
  globalTextStore2.destroy();
  setTimeout(() => {
    inspectCacheMap(); // expect 1
    localTextStore.destroy();
    setTimeout(() => {
      inspectCacheMap(); // expect 0
    }, 1000);
  }, 1000);
}, 1000);
