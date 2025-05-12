import { ID } from "../constant/ID";
import { Timestamp } from "./_utility";
import { Todo } from "./Todo";

type TodoList = {
  id: ID["TODO_LIST"];
  title: string;
  todos: Todo[];
  createdAt: Timestamp;
};

export type { TodoList };
