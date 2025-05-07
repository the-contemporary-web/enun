import { create } from "@enun/store";

import { createHook } from "../create/createHook";

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

const [useText, useTextStore] = createHook(TextStore);
const [useTextLocal] = createHook(TextStore.local());

export { TextStore, useText, useTextLocal, useTextStore };
