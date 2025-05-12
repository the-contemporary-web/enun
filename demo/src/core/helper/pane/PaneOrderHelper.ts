import { ID } from "core/constant/ID";
import { Pane } from "core/entity/Pane";

const hoistPaneOrderWithId = (panes: Pane[], id: ID["PANE"]) => {
  const target = panes.find(pane => pane.id === id);
  if (!target) throw new Error("Pane not found");

  const orderedRest = panes
    .filter(pane => pane.id !== id)
    .map((pane, index) => ({
      ...pane,
      display: { ...pane.display, order: index + 1 },
    }));

  const hoistedTarget = {
    ...target,
    display: { ...target.display, order: 0 },
  };

  return [hoistedTarget, ...orderedRest];
};

const PaneOrderHelper = {
  hoistPaneOrderWithId,
} as const;

export { PaneOrderHelper };
