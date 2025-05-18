import { create } from "@enun/store";

import { createHook } from "../create/createHook";

interface TextStore {
  id?: number;
  text: string;
  write: (text: string) => void;
  clear: () => void;
}

const TextStore = create<TextStore, [{ id?: number; text: string }]>()
  .key(({ id }) => id)
  .define(({ set }, { id, text }) => {
    const write = (text: string) => {
      set({ text });
    };
    const clear = () => {
      set({ text: "" });
    };
    return {
      id,
      text,
      write,
      clear,
    };
  });

const [useText, useTextStore] = createHook(TextStore);
const [useTextLocal] = createHook(TextStore.local());

export { TextStore, useText, useTextLocal, useTextStore };
