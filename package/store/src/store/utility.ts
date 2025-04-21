import { Store } from "./Store";
import { ComposeMap } from "./type";

type TypeOf<S extends Store<object, object, ComposeMap>> = S extends Store<infer T, object, ComposeMap> ? T : never;
type DepsOf<S extends Store<object, object, ComposeMap>> =
  S extends Store<object, infer Deps, ComposeMap> ? Deps : never;

export type { DepsOf, TypeOf };
