import { TodoListRepository } from "core/repository/TodoListRepository";

import { createViewStore } from "../ViewStore";

const TodoListsViewStore = createViewStore({
  key: () => "todoLists",
  from: () => TodoListRepository.readAll(),
});

export { TodoListsViewStore };
