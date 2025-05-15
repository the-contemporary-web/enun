import { Article } from "@flexive/core";
import { usePane } from "core/store/pane/PaneStore";

import { usePaneDisplayStyle } from "../_hook/usePaneDisplayStyle";
import { PaneHeader } from "./PaneHeader";

export const Pane = () => {
  const { pane, updating } = usePane();
  const style = usePaneDisplayStyle(pane.display);

  return (
    <Article style={style}>
      <PaneHeader />
      {updating && <div>Updating...</div>}
    </Article>
  );
};
