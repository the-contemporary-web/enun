# @enun/store

```tsx
import { createHook } from "@enun/react";
import { create, StoreImpl } from "@enun/store";
import { Pane } from "core/entity/Pane";

import { ViewStore } from "../../ViewStore";
import { PaneStore } from "../PaneStore";
import { PanesViewStore } from "../view";

interface PanesStore {
  panes: ReturnType<PaneStore>[];
}

const PanesStore = create<PanesStore>().define(({ get, set, compose, decompose }) => {
  const [{ subscribe: subscribeView }, { view }] = compose(PanesViewStore({}));

  const composePanes = (panes: Pane[]) => panes.map(PaneStore).map(compose);
  const decomposePanes = () => get().panes.forEach(decompose);

  const update = (panes: Pane[]) => {
    decomposePanes();
    set({ panes: composePanes(panes) });
  };

  subscribeView(({ status, view }) => {
    if (status === "FULFILLED") {
      update(view);
    }
  });

  return {
    panes: composePanes(panes ?? []),
  };
});

export { PanesStore };
```

```tsx
const PaneStore = create<PaneStore, [Pane]>()
  .key(pane => pane.id)
  .define(({ injected, compose, set }) => {
    const [{ subscribe: subscribePanes }, { focus, focusedId }] = compose(PanesStore);
    const [{ subscribe: subscribeUpdateIntent }, { execute: update }] = compose(UpdatePaneIntentStore({ id: pane.id }));
    const [{ subscribe: subscribeDebouncer }, { debounce }] = compose(DebouncerStore());

    const updateDebounced = debounce(update, 500);
    const updateWithSetter = (fn: (prev: Pane) => Pane) => {
      set(prev => {
        const newPane = fn(prev.pane);
        updatePaneDebounced(newPane);
        return {
          pane: newPane,
        };
      });
    };

    const updateDisplay = (partial: Partial<PaneDisplay>) => {
      if (!focusedId) {
        focus();
      }
      updateWith(prev => ({
        ...prev,
        display: { ...prev.display, ...partial },
      }));
    };

    // updating
    subscribeDebouncer(({ debouncing }) => {
      set({ updating: debouncing });
    });
    subscribeUpdateIntent(({ busy }) => {
      set({ updating: busy });
    });

    // focused
    subscribePanes(({ focusedId }) => {
      if (focusedId !== injected.pane.id) {
        return;
      }
      set({ focused: true });
    });

    return {
      pane: injected.pane,
      updateDisplay,
      updating: false,
      focused: false,
    };
  });

const PaneHandle = () => {
  const { updateDisplay, focused, pane } = PaneStore.use();
};
```
