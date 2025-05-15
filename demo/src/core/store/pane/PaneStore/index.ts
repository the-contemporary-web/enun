import { createHook } from "@enun/react";
import { create } from "@enun/store";
import { Pane, PaneDisplay } from "core/entity/Pane";
import debounce from "lodash.debounce";

import { UpdatePaneIntentStore } from "../intent";

interface PaneStore {
  pane: Pane;
  updating: boolean;
  updateDisplay: (partial: Partial<PaneDisplay>) => void;
}

const PaneStore = create<PaneStore, { pane: Pane }>()
  .key(({ pane }) => ({ paneId: pane.id }))
  .define(({ injected: { pane }, compose, set }) => {
    const updateIntent = compose(UpdatePaneIntentStore.use({ id: pane.id }));
    const excuteUpdateDebounced = debounce((pane: Pane) => {
      void updateIntent.get().execute(pane);
    }, 500);

    const update = (fn: (prev: Pane) => Pane) => {
      set(prev => {
        const newPane = fn(prev.pane);
        excuteUpdateDebounced(newPane);
        return {
          pane: newPane,
        };
      });
    };
    updateIntent.subscribe(({ status }) => {
      set({ updating: status === "BUSY" });
    });

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
