import { ID } from "../constant/ID";
import { PANE_CONTENT_TYPE } from "../constant/PANE_CONTENT_TYPE";

type PaneContent =
  | {
      readonly type: PANE_CONTENT_TYPE["MEMO"];
      readonly memoId: ID["MEMO"];
    }
  | {
      type: PANE_CONTENT_TYPE["TODO_LIST"];
      todoListId: ID["TODO_LIST"];
    };

type PaneDisplay = {
  top: number;
  left: number;
  width: number;
  height: number;
  order: number;
  minimized: boolean;
};

type Pane = {
  readonly id: ID["PANE"];
  content: PaneContent;
  display: PaneDisplay;
};

export type { Pane, PaneContent, PaneDisplay };
