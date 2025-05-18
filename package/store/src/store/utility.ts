import { Store } from "../type";
import { Storable, Dependencies } from "../type";

type TypeOf<S extends Store<Storable, Dependencies>> = S extends Store<infer T, Dependencies> ? T : never;
type DepsOf<S extends Store<Storable, Dependencies>> = S extends Store<Storable, infer Deps> ? Deps : never;

export type { DepsOf, TypeOf };
