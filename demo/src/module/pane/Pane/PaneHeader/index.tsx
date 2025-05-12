import { Header } from "@flexive/core";
import { usePane } from "core/store/PaneStore";
import { useCallback } from "react";
import { DragCoords, useDrag } from "utility/drag";

export const PaneHeader = () => {
  const { updateDisplay } = usePane();

  const handleDrag = useCallback(
    (coords: DragCoords) => {
      updateDisplay({
        left: Math.max(coords.x, 0),
        top: Math.max(coords.y, 0),
      });
    },
    [updateDisplay],
  );

  const { drag } = useDrag({
    onMove: handleDrag,
  });

  return (
    <Header
      style={{ backgroundColor: "blue" }}
      sizeM={50}
      onMouseDown={e => {
        e.preventDefault();
        drag(e);
      }}
    ></Header>
  );
};
