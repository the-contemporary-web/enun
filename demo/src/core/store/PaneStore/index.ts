import { createHook } from "@enun/react";
import { create } from "@enun/store";
import { ID } from "core/constant/ID";
import { Pane, PaneDisplay } from "core/entity/Pane";
import { PaneRepository } from "core/repository/PaneRepository";
import debounce from "lodash.debounce";

import { createIntentStore } from "../IntentStore";

interface PaneStore {
  pane: Pane;
  updating: boolean;
  updateDisplay: (partial: Partial<PaneDisplay>) => void;
}

const UpdatePaneIntent = createIntentStore<unknown, [Pane], { id: ID["PANE"] }>({
  key: ({ id }) => id,
  to: ({ id }, pane) => PaneRepository.updatePane(id, pane),
  config: {
    retryBusyRequest: true,
  },
});

const PaneStore = create<PaneStore, { pane: Pane }>()
  .key(({ pane }) => ({ paneId: pane.id }))
  .define(({ injected: { pane }, compose, set }) => {
    const updateIntent = compose(UpdatePaneIntent.use({ id: pane.id }));
    updateIntent.subscribe(({ status }) => {
      set({ updating: status === "BUSY" });
    });

    const debouncedUpdate = debounce((pane: Pane) => {
      void updateIntent.get().execute(pane);
    }, 500);
    const update = (fn: (prev: Pane) => Pane) => {
      set(prev => {
        const newPane = fn(prev.pane);
        debouncedUpdate(newPane);
        return {
          pane: newPane,
        };
      });
    };

    const updateDisplay = (partial: Partial<PaneDisplay>) => {
      update(prev => ({
        ...prev,
        display: {
          ...prev.display,
          ...partial,
        },
      }));
    };

    return {
      pane,
      updating: false,
      updateDisplay,
    };
  });

const [usePane, usePaneStore] = createHook(PaneStore);

export { PaneStore, usePane, usePaneStore };
