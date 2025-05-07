import { StoreProvider } from "../context";
import { useText, useTextLocal, useTextStore } from "./store";

export const App = () => {
  const [textStore1] = useTextStore({ text: "Hello world" });
  const [textStore2] = useTextStore({ id: 1, text: "Hello world2" });

  return (
    <div>
      <StoreProvider store={[textStore1]}>
        <TextInput />
        <TextInput />
        <StoreProvider store={[textStore2]}>
          <TextInput />
        </StoreProvider>
        <TextInputLocal />
      </StoreProvider>
    </div>
  );
};

const TextInput = () => {
  const { text, write } = useText();
  return (
    <input
      value={text}
      onChange={e => {
        write(e.target.value);
      }}
    />
  );
};

const TextInputLocal = () => {
  const { text, write } = useTextLocal({ text: "Hello local" });
  return (
    <input
      value={text}
      onChange={e => {
        write(e.target.value);
      }}
    />
  );
};
