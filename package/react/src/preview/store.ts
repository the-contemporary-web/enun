import { create } from "@enun/store";

import { createHook } from "../createHook";

interface TextStore {
  id?: number;
  text: string;
  write: (text: string) => void;
  clear: () => void;
}

const TextStore = create<TextStore, { id?: number; text: string }>()
  .key(deps => deps.id)
  .define(({ injected, set }) => {
    const write = (text: string) => {
      set({ text });
    };
    const clear = () => {
      set({ text: "" });
    };
    return {
      id: injected.id,
      text: injected.text,
      write,
      clear,
    };
  });

const useTextStore = createHook(TextStore);
const useTextStoreLocal = createHook(TextStore.local());

export { TextStore, useTextStore, useTextStoreLocal };
