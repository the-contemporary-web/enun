import { createHook } from "@enun/react";
import { TodoListRepository } from "core/repository/TodoListRepository";

import { createViewStore } from "../ViewStore";

const TodoListsViewStore = createViewStore({
  key: () => "todoLists",
  from: () => TodoListRepository.readAll(),
});

const useTodoListsView = createHook(TodoListsViewStore);

export { TodoListsViewStore, useTodoListsView };
