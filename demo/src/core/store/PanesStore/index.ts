import { createHook } from "@enun/react";
import { create, StoreImpl } from "@enun/store";
import { Pane } from "core/entity/Pane";
import { PaneRepository } from "core/repository/PaneRepository";

import { PaneStore } from "../PaneStore";
import { createViewStore, ViewStore } from "../ViewStore";

interface PanesStore {
  view: StoreImpl<ViewStore<Pane[]>>;
  panes: StoreImpl<PaneStore>[];
}

const PanesViewStore = createViewStore<Pane[], object>({
  key: () => "panes",
  from: PaneRepository.readAll,
});

const PanesStore = create<PanesStore>().define(({ set, compose }) => {
  const view = compose(PanesViewStore.use({}));

  const update = (panes: Pane[]) => {
    set(prev => {
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
const [usePanesView, usePanesViewStore] = createHook(PanesViewStore);

export { PanesStore, PanesViewStore, usePanes, usePanesStore, usePanesView, usePanesViewStore };
