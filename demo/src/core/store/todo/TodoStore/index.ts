import { Todo } from "@entity/Todo";
import { createHook } from "@enun/react";
import { create, StoreImpl } from "@enun/store";

import { RichTextContentStore } from "../../RichTextContentStore";

interface TodoStore {
  todo: Todo;
  setName: (title: Todo["name"]) => void;
  toggle: () => void;
  reportStore: StoreImpl<RichTextContentStore>;
}

const TodoStore = create<TodoStore, { todo: Todo }>()
  .key(({ todo }) => ({ todoId: todo.id }))
  .define(({ injected: { todo }, compose, set }) => {
    const setName = (name: Todo["name"]) => {
      set(({ todo }) => ({ todo: { ...todo, name } }));
    };
    const toggle = () => {
      set(({ todo }) => {
        if (todo.type !== "TOGGLE") {
          return {};
        }
        return { todo: { ...todo, done: !todo.done } };
      });
    };

    const reportStore = compose(
      RichTextContentStore.appendKey({ name: "ReportTodo", todoId: todo.id }).use({
        content: todo.type === "REPORT" ? todo.report : undefined,
      }),
    );
    reportStore.subscribe(({ contentLength }) => {
      set(({ todo }) => {
        if (todo.type !== "REPORT") return {};
        return { todo: { ...todo, done: contentLength >= todo.minReportLength } };
      });
    });

    return {
      todo,
      setName,
      toggle,
      reportStore,
    };
  });

const [useTodo, useTodoStore] = createHook(TodoStore);

export { TodoStore, useTodo, useTodoStore };
