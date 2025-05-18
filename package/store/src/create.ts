import { StoreBuilderImpl } from "./store";
import { Dependencies } from "./type";
import { Storable } from "./type";

const create = <T extends Storable, Deps extends Dependencies>() => {
  return new StoreBuilderImpl<T, Deps>({});
};

export { create };
