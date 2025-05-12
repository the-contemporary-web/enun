import { createHook } from "@enun/react";
import { PaneRepository } from "core/repository/PaneRepository";

import { createViewStore } from "../ViewStore";

const PanesViewStore = createViewStore({
  key: () => "panes",
  from: PaneRepository.readAll,
});

const [usePanesView, usePanesViewStore] = createHook(PanesViewStore);

export { PanesViewStore, usePanesView, usePanesViewStore };
