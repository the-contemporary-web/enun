import { Store } from "./Store";

type TypeOf<S extends Store<object, object>> = S extends Store<infer T, object> ? T : never;
type DepsOf<S extends Store<object, object>> = S extends Store<object, infer Deps> ? Deps : never;

export type { DepsOf, TypeOf };
