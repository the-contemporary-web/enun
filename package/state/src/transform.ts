import deepmerge from "deepmerge";
import { produce } from "immer";

type Transformer<Value> = (draft: Value) => void | Value;

const transform = <Value>(prev: Value, input: Transformer<Value> | Partial<Value>): Value => {
  if (typeof input === "function") {
    return produce(prev, input);
  }
  return deepmerge(prev, input);
};

export { transform };
export type { Transformer };
