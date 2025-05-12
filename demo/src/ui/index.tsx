import { Main } from "@flexive/core";
import { FullScreen } from "design/component/surface";

import { ControlPanels } from "./ControlPanels";
import { MainFooter } from "./MainFooter";
import { MainHeader } from "./MainHeader";
import { Panes } from "./Panes";

export const MainPage = () => {
  return (
    <FullScreen>
      <MainHeader />
      <Main f hide>
        <Panes />
      </Main>
      <MainFooter />
      <ControlPanels />
    </FullScreen>
  );
};
