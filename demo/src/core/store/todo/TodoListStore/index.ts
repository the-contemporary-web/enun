import { createHook } from "@enun/react";
import { create } from "@enun/store";
import { TodoList } from "core/entity/TodoList";

interface TodoListStore {
  todoList: TodoList;
}

const TodoListStore = create<TodoListStore, { todoList: TodoList }>()
  .key(({ todoList }) => ({ todoListId: todoList.id }))
  .define(({ injected }) => {
    return {
      todoList: injected.todoList,
    };
  });

const [useTodoList, useTodoListStore] = createHook(TodoListStore);

export { TodoListStore, useTodoList, useTodoListStore };
