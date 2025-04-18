import { StoreProvider } from "../context";
import { TextStore, useTextStore, useTextStoreLocal } from "./store";

export const App = () => {
  return (
    <div>
      <StoreProvider store={[TextStore.use({ text: "Hello world" })]}>
        <TextInput />
        <TextInput />
        <StoreProvider store={[TextStore.use({ id: 1, text: "Hello world2" })]}>
          <TextInput />
        </StoreProvider>
        <TextInputLocal />
      </StoreProvider>
    </div>
  );
};

const TextInput = () => {
  const { text, write } = useTextStore();
  return <input value={text} onChange={e => write(e.target.value)} />;
};

const TextInputLocal = () => {
  const { text, write } = useTextStoreLocal({ text: "Hello local" });
  return <input value={text} onChange={e => write(e.target.value)} />;
};
