import { StoreProvider } from "@enun/react";
import { usePanes } from "core/store/pane/PanesStore";
import { Pane } from "module/pane/Pane";
import { Catch } from "module/system/Catch";

export const Panes = () => {
  const { panes, view } = usePanes({});

  return (
    <StoreProvider store={[view]}>
      <Catch>
        {panes.map(paneStore => (
          <StoreProvider key={paneStore.key} store={[paneStore]}>
            <Pane />
          </StoreProvider>
        ))}
      </Catch>
    </StoreProvider>
  );
};
