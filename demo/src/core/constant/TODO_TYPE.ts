const TODO_TYPES = ["TOGGLE", "REPORT"] as const;
type TODO_TYPES = (typeof TODO_TYPES)[number];

type TODO_TYPE = {
  [T in TODO_TYPES]: T;
};

export { TODO_TYPES };
export type { TODO_TYPE };
