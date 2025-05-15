import { Todo } from "@entity/Todo";
import { StoreProvider } from "@enun/react";
import { Li } from "@flexive/core";
import { useTodoStore } from "core/store/todo/TodoStore";

import { TodoName } from "./TodoName";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [todoStore] = useTodoStore({ todo });

  return (
    <StoreProvider store={[todoStore]}>
      <Li>
        <TodoName />
      </Li>
    </StoreProvider>
  );
};
