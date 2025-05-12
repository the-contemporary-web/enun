import { ID } from "core/constant/ID";
import { PANE_CONTENT_TYPE } from "core/constant/PANE_CONTENT_TYPE";

type PaneContent =
  | {
      type: PANE_CONTENT_TYPE["MEMO"];
      memoId: ID["MEMO"];
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
  id: ID["PANE"];
  content: PaneContent;
  display: PaneDisplay;
};

export type { Pane, PaneContent, PaneDisplay };
