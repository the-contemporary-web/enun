import { Div, Input } from "@flexive/core";
import { useTodo } from "core/store/todo/TodoStore";
import { ChangeEventHandler, useState } from "react";

export const TodoName = () => {
  const [editable, setEditable] = useState(false);

  const { todo, setName } = useTodo();

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
