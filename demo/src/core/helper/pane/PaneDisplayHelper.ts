import { PaneDisplay } from "core/entity/Pane";
import { CSSProperties } from "react";

const getInitialPaneDisplay = (): PaneDisplay => {
  return {
    top: 120,
    left: 160,
    width: 400,
    height: 300,
    order: 0,
    minimized: false,
  };
};

const paneDisplayToStyle = (display: PaneDisplay): CSSProperties => {
  return {
    position: "fixed",
    top: display.top,
    left: display.left,
    width: display.width,
    height: display.height,
    backgroundColor: "red",
    zIndex: 1000 - display.order,
  };
};

const PaneDisplayHelper = {
  getInitialPaneDisplay,
  paneDisplayToStyle,
} as const;

export { PaneDisplayHelper };
