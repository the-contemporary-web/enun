/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalState, State } from "./state";
import { StateStore } from "./store";

type AnyInternalState = InternalState<any>;
type AnyState = State<any>;

type AnyStateStore = StateStore<any>;

export type { AnyInternalState, AnyState, AnyStateStore };
