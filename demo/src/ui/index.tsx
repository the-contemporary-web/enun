import { Div } from "@flexive/core";
import { FullScreen, Modal } from "design/component/surface";
import { Checkable, Clickable } from "design/component/trigger";
import { useState } from "react";

export const MainPage = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <FullScreen alignC alignM>
      <Div row g={12}>
        <Modal p={40}>
          <Clickable>CLICK</Clickable>
        </Modal>
        <Modal p={40} focusable>
          <Clickable theme="plum">CLICK</Clickable>
        </Modal>
        <Modal p={40} focusable disabled>
          <Clickable theme="violet" disabled>
            CLICK
          </Clickable>
        </Modal>
        <Modal p={40} focusable focus={toggle}>
          <Checkable theme="tomato" checked={toggle} onCheck={setToggle}>
            Select
          </Checkable>
        </Modal>
        <Modal p={40}>
          <Checkable checked={toggle} onCheck={setToggle} disabled>
            Select
          </Checkable>
        </Modal>
      </Div>
    </FullScreen>
  );
};
