import { ID } from "core/constant/ID";
import { Pane } from "core/entity/Pane";
import { PaneDisplayHelper, PaneOrderHelper } from "core/helper/pane";
import { nanoid } from "nanoid";

import { LocalStorageRepository } from "../LocalStorageRepository";
import { StaticRepository } from "../StaticRepository";
import { TodoListRepository } from "../TodoListRepository";

const PANE_KEY = "ENUN_DEMO_PANE";
const PANE_STATIC_PATH = "/panes.json";

const _get = async () => {
  const panes = await LocalStorageRepository.get<Pane[]>(PANE_KEY, []);
  return panes;
};

const _set = async (panes: Pane[]) => {
  await LocalStorageRepository.set(PANE_KEY, panes);
  return true;
};

const read = async (id: ID["PANE"]) => {
  const panes = await _get();
  const pane = panes.find(pane => pane.id === id);
  if (!pane) throw new Error("Pane not found");
  return pane;
};

const readAll = async () => {
  const lists = await _get();
  return lists;
};

const createTodoListPane = async (title: string) => {
  const todoList = await TodoListRepository.create(title);
  const pane: Pane = {
    id: nanoid(),
    content: {
      type: "TODO_LIST",
      todoListId: todoList.id,
    },
    display: PaneDisplayHelper.getInitialPaneDisplay(),
  };
  const panes = await _get();
  panes.push(pane);
  await _set(panes);
  return pane;
};

const updatePane = async (id: ID["PANE"], pane: Pane, preserveOrder?: boolean) => {
  const panes = await _get();
  const index = panes.findIndex(pane => pane.id === id);
  if (index === -1) throw new Error("Pane not found");

  panes[index] = pane;
  if (preserveOrder) {
    await _set(panes);
    return panes;
  }
  const reordered = PaneOrderHelper.hoistPaneOrderWithId(panes, id);
  await _set(reordered);
  return reordered;
};

const preload = async () => {
  const hasPanes = !!localStorage.getItem(PANE_KEY);
  if (hasPanes) {
    return;
  }
  const defaultPanes = await StaticRepository.get<Pane[]>(PANE_STATIC_PATH, []);
  await _set(defaultPanes);
  return;
};

const PaneRepository = {
  read,
  readAll,
  createTodoListPane,
  updatePane,
  preload,
} as const;

export { PaneRepository };
