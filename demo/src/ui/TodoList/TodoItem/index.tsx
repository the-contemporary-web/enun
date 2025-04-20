import { Todo } from "@entity/Todo";
import { StoreProvider, useStoreInit } from "@enun/react";
import { Li } from "@flexive/core";
import { TodoStore } from "core/store/TodoStore";

import { TodoName } from "./TodoName";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const todoStore = useStoreInit(TodoStore, { todo });

  return (
    <StoreProvider store={[todoStore]}>
      <Li>
        <TodoName />
      </Li>
    </StoreProvider>
  );
};
