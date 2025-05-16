import { usePane } from "core/store/pane/PaneStore";
import { ReactElement } from "react";

import { usePaneDisplayStyle } from "../_hook/usePaneDisplayStyle";
import { Container } from "./Container";
import { Header } from "./Header";

type Pane = ReactElement & {
  Header: ReactElement;
};

export const Pane = () => {
  const { pane, updating } = usePane();
  const style = usePaneDisplayStyle(pane.display);

  return (
    <Pane.Container style={style}>
      <Pane.Header />
      {updating && <div>Updating...</div>}
    </Pane.Container>
  );
};

Pane.Container = Container;
Pane.Header = Header;
