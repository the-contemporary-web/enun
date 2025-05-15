import { createHook } from "@enun/react";
import { ID } from "core/constant/ID";
import { Pane } from "core/entity/Pane";
import { PaneRepository } from "core/repository/PaneRepository";

import { createIntentStore } from "../IntentStore";
import { PanesViewStore } from "./view";

const CreateTodoListPaneIntentStore = createIntentStore<unknown, [{ title: string }]>({
  key: () => ["pane", "create"],
  to: (_, { title }) => PaneRepository.createTodoListPane(title),
  next: () => {
    PanesViewStore.forEach(store => {
      void store.get().invalidate();
    });
  },
});
const [useCreateTodoListPaneIntent, useCreateTodoListPaneIntentStore] = createHook(CreateTodoListPaneIntentStore);

const UpdatePaneIntentStore = createIntentStore<unknown, [Pane], { id: ID["PANE"] }>({
  key: ({ id }) => ["pane", "update", id],
  to: ({ id }, pane) => PaneRepository.updatePane(id, pane),
  config: {
    retryBusyRequest: true,
  },
});
const [useUpdatePaneIntent, useUpdatePaneIntentStore] = createHook(UpdatePaneIntentStore);

export {
  CreateTodoListPaneIntentStore,
  UpdatePaneIntentStore,
  useCreateTodoListPaneIntent,
  useCreateTodoListPaneIntentStore,
  useUpdatePaneIntent,
  useUpdatePaneIntentStore,
};
