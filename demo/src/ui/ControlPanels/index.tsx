import { Div } from "@flexive/core";
import { Clickable } from "design/component/trigger";

const CONTROL_PANEL_BOTTOM_MARGIN = "10vh";

export const ControlPanels = () => {
  return (
    <Div absolute bottom={CONTROL_PANEL_BOTTOM_MARGIN} sizeC="100%" sizeM={0} alignC>
      <Div row g={8}>
        <Clickable theme="violet">+ MEMO</Clickable>
      </Div>
    </Div>
  );
};
