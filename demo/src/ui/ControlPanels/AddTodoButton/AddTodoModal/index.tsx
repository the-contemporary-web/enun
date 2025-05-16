import { useCreateTodoListPaneIntent } from "core/store/pane/intent";
import { Modal } from "design/component/surface";

export const AddTodoModal = () => {
  const { execute, isBusy } = useCreateTodoListPaneIntent();

  return <Modal></Modal>;
};
