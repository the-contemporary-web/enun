import { useCreateTodoListPaneIntent } from "core/store/pane/intent";
import { Clickable } from "design/component/trigger";

export const AddTodoButton = () => {
  const { isBusy } = useCreateTodoListPaneIntent();

  return <Clickable theme="ruby">{isBusy ? "BUSY" : "+ TODO"}</Clickable>;
};
