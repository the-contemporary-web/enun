import { StoreProvider } from "../context";
import { useStoreInit } from "../useStoreInit";
import { TextStore, useTextStore, useTextStoreLocal } from "./store";

export const App = () => {
  const store1 = useStoreInit(TextStore, { text: "Hello world" });
  const store2 = useStoreInit(TextStore, { id: 1, text: "Hello world2" });

  return (
    <div>
      <StoreProvider store={[store1]}>
        <TextInput />
        <TextInput />
        <StoreProvider store={[store2]}>
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
