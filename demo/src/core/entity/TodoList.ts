import { ID } from "../constant/ID";
import { Timestamp } from "./_utility";
import { Todo } from "./Todo";

type TodoList = {
  readonly id: ID["TODO_LIST"];
  readonly createdAt: Timestamp;
  title: string;
  todos: Todo[];
};

export type { TodoList };
