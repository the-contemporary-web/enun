import { Todo } from "@entity/Todo";
import { createHook } from "@enun/react";
import { create, StoreImpl } from "@enun/store";

import { RichTextContentStore } from "../RichTextContentStore";

interface TodoStore {
  todo: Todo;
  setName: (title: Todo["name"]) => void;
  toggle: () => void;
  reportStore: StoreImpl<RichTextContentStore>;
}

const TodoStore = create<TodoStore, { todo: Todo }>()
  .key(({ todo }) => ({ todoId: todo.id }))
  .compose(({ todo }) => ({
    reportStore: RichTextContentStore.appendKey({ name: "ReportTodo", todoId: todo.id }).use({
      content: todo.type === "REPORT" ? todo.report : undefined,
    }),
  }))
  .define(({ injected: { todo }, composed: { reportStore }, set }) => {
    const setName = (name: Todo["name"]) => set(({ todo }) => ({ todo: { ...todo, name } }));
    const toggle = () =>
      set(({ todo }) => {
        if (todo.type !== "TOGGLE") return {};
        return { todo: { ...todo, done: !todo.done } };
      });

    reportStore.subscribe(({ contentLength }) =>
      set(({ todo }) => {
        if (todo.type !== "REPORT") return {};
        return { todo: { ...todo, done: contentLength >= todo.minReportLength } };
      }),
    );

    return {
      todo,
      setName,
      toggle,
      reportStore,
    };
  });

const useTodoStore = createHook(TodoStore);

export { TodoStore, useTodoStore };
