import { Div, Input } from "@flexive/core";
import { useTodoStore } from "core/store/TodoStore";
import { ChangeEventHandler, useState } from "react";

export const TodoName = () => {
  const [editable, setEditable] = useState(false);

  const { todo, setName } = useTodoStore();

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = e => {
    setName(e.target.value);
  };

  return (
    <Div f>
      {!editable && (
        <Div f onClick={() => setEditable(true)}>
          {todo.name}
        </Div>
      )}
      {editable && <Input f value={todo.name} onChange={handleChangeName} onBlur={() => setEditable(false)} />}
    </Div>
  );
};
