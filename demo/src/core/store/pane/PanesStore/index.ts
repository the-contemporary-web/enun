import { createHook } from "@enun/react";
import { create, StoreImpl } from "@enun/store";
import { Pane } from "core/entity/Pane";

import { ViewStore } from "../../ViewStore";
import { PaneStore } from "../PaneStore";
import { PanesViewStore } from "../view";

interface PanesStore {
  view: StoreImpl<ViewStore<Pane[]>>;
  panes: StoreImpl<PaneStore>[];
}

const PanesStore = create<PanesStore>().define(({ set, compose /*, decompose */ }) => {
  const view = compose(PanesViewStore.use({}));

  const update = (panes: Pane[]) => {
    set(prev => {
      /* 
      prev.panes.forEach(decompose)
      const newPanes = panes.map(pane => PaneStore.use({ pane }))
      return {
        panes: newPanes,
        }
        */
      prev.panes.forEach(store => {
        store.destroy();
      });
      return {
        panes: panes.map(pane => PaneStore.use({ pane })),
      };
    });
  };

  view.subscribe(({ status, view }) => {
    if (status === "FULFILLED") {
      update(view);
    }
  });

  const initialPanes = view.get().view?.map(pane => PaneStore.use({ pane })) ?? [];

  return {
    panes: initialPanes,
    view,
  };
});

const [usePanes, usePanesStore] = createHook(PanesStore);

export { PanesStore, usePanes, usePanesStore };
