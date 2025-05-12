import { ID } from "core/constant/ID";
import { TodoList } from "core/entity/TodoList";
import { nanoid } from "nanoid";

import { LocalStorageRepository } from "../LocalStorageRepository";

const TODO_LISTS_KEY = "ENUN_DEMO_TODO_LISTS";

const _get = async () => {
  const lists = await LocalStorageRepository.get<TodoList[]>(TODO_LISTS_KEY, []);
  return lists;
};

const _set = async (list: TodoList[]) => {
  await LocalStorageRepository.set(TODO_LISTS_KEY, list);
  return true;
};

const read = async (id: ID["TODO_LIST"]) => {
  const lists = await _get();
  const list = lists.find(todoList => todoList.id === id);
  if (!list) throw new Error("TodoList not found");
  return list;
};

const readAll = async () => {
  const lists = await _get();
  return lists;
};

const create = async (title: string) => {
  const lists = await _get();
  const list: TodoList = {
    id: nanoid(),
    title,
    todos: [],
    createdAt: Date.now(),
  };
  lists.push(list);
  await _set(lists);
  return list;
};

const update = async (id: ID["TODO_LIST"], list: TodoList) => {
  const lists = await _get();
  const index = lists.findIndex(list => list.id === id);
  if (index === -1) throw new Error("TodoList not found");
  lists[index] = list;
  await _set(lists);
  return list;
};

const delete_ = async (id: ID["TODO_LIST"]) => {
  const lists = await _get();
  const index = lists.findIndex(list => list.id === id);
  if (index === -1) throw new Error("TodoList not found");
  lists.splice(index, 1);
  await _set(lists);
};

const TodoListRepository = {
  read,
  readAll,
  create,
  update,
  delete: delete_,
};

export { TodoListRepository };
