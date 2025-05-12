import { PaneDisplay } from "core/entity/Pane";
import { PaneDisplayHelper } from "core/helper/pane";
import { useMemo } from "react";

const usePaneDisplayStyle = (display: PaneDisplay) => {
  const style = useMemo(() => {
    return PaneDisplayHelper.paneDisplayToStyle(display);
  }, [...Object.values(display)]);

  return style;
};

export { usePaneDisplayStyle };
