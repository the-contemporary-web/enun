import { Div, Input } from "@flexive/core";
import { useTodoStore } from "core/store/TodoStore";
import { ChangeEventHandler, useState } from "react";

export const TodoName = () => {
  const [editable, setEditable] = useState(false);

  const { todo, setName } = useTodoStore();

  const handleEditStart = () => {
    setEditable(true);
  };
  const handleEditEnd = () => {
    setEditable(false);
  };

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = e => {
    setName(e.target.value);
  };

  return (
    <Div f>
      {!editable && (
        <Div f onClick={handleEditStart}>
          {todo.name}
        </Div>
      )}
      {editable && <Input f value={todo.name} onChange={handleChangeName} onBlur={handleEditEnd} />}
    </Div>
  );
};
