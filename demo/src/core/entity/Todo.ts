import { ID } from "../constant/ID";
import { TODO_TYPE } from "../constant/TODO_TYPE";
import { RichTextContent } from "./RichTextContent";

type BaseTodo = {
  id: ID["TODO"];
  name: string;
  done: boolean;
};

type ToggleTodo = BaseTodo & {
  type: TODO_TYPE["TOGGLE"];
};
type ReportTodo = BaseTodo & {
  type: TODO_TYPE["REPORT"];
  report: RichTextContent;
  minReportLength: number;
};

type Todo = ToggleTodo | ReportTodo;

export type { ReportTodo, Todo, ToggleTodo };
