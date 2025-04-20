import { Todo } from "core/entity/Todo";
import { nanoid } from "nanoid";

export const mockTodos: Todo[] = [
  {
    type: "TOGGLE",
    id: nanoid(),
    name: "mock todo",
    done: false,
  },
];
