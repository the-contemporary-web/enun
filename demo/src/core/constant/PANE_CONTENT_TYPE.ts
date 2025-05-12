const PANE_CONTENT_TYPES = ["TODO_LIST", "MEMO"] as const;
type PANE_CONTENT_TYPES = (typeof PANE_CONTENT_TYPES)[number];

type PANE_CONTENT_TYPE = {
  [T in PANE_CONTENT_TYPES]: T;
};

export { PANE_CONTENT_TYPES };
export type { PANE_CONTENT_TYPE };
