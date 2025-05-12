import { useCallback, useEffect, useReducer } from "react";

import { DragCoords } from "./type";

type DragStateIdle = {
  dragging: false;
  modifyX: undefined;
  modifyY: undefined;
};
type DragStateDragging = {
  dragging: true;
  modifyX: number;
  modifyY: number;
};

type DragState = DragStateIdle | DragStateDragging;

type DragAction = { type: "START"; modifyX: number; modifyY: number } | { type: "END" };

type UseDragParam = {
  onStart?: (coords: DragCoords) => void;
  onMove?: (coords: DragCoords) => void;
  onEnd?: (coords: DragCoords) => void;
};

const useDrag = ({ onStart, onMove, onEnd }: UseDragParam) => {
  const [state, dispatch] = useReducer<DragState, [DragAction]>(
    (_, action) => {
      switch (action.type) {
        case "START":
          return {
            dragging: true,
            modifyX: action.modifyX,
            modifyY: action.modifyY,
          };
        case "END":
          return {
            dragging: false,
            modifyX: undefined,
            modifyY: undefined,
          };
      }
    },
    {
      dragging: false,
      modifyX: undefined,
      modifyY: undefined,
    },
  );

  const drag = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      dispatch({
        type: "START",
        modifyX: left - e.clientX,
        modifyY: top - e.clientY,
      });
      onStart?.({ x: left, y: top });
    },
    [onStart],
  );

  const moveHandler = useCallback(
    (e: MouseEvent) => {
      if (!state.dragging) return;

      const x = e.clientX + state.modifyX;
      const y = e.clientY + state.modifyY;
      onMove?.({ x, y });
    },
    [state, onMove],
  );

  const upHandler = useCallback(
    (e: MouseEvent) => {
      if (!state.dragging) return;
      const x = e.clientX + state.modifyX;
      const y = e.clientY + state.modifyY;
      dispatch({ type: "END" });
      onEnd?.({ x, y });
    },
    [state, onEnd],
  );

  useEffect(() => {
    if (!state.dragging) return;
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
    return () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
    };
  }, [state.dragging, moveHandler, upHandler]);

  return {
    drag,
  };
};

export { useDrag };
