import { Ul } from "@flexive/core";
import { mockTodos } from "mock/todo";

import { TodoItem } from "./TodoItem";

export const TodoList = () => {
  return (
    <Ul>
      {mockTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </Ul>
  );
};
