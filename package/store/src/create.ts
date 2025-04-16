import { StoreBuilder } from "./store";

const create = <T extends object, Deps extends object = object>() => {
  const builder = new StoreBuilder<T, Deps>();
  return builder;
};

export { create };
