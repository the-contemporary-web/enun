import { awaitState, state, subscribe } from "./index";

const getCountAfterDelay = () => Promise.resolve(0);

const CountState = state<{ data: number }>()({
  is: () => getCountAfterDelay().then(count => ({ data: count })),
  acts: ({ set }) => {
    const add = () => {
      set(prev => {
        prev.data++;
      });
    };
    const subtract = () => {
      set(prev => {
        prev.data--;
      });
    };
    return {
      add,
      subtract,
    };
  },
});

const main = async () => {
  const countState = await awaitState(CountState());
  const countAction = countState.action;

  const app = document.getElementById("app");
  if (!app) throw new Error("App not found");

  const counter = document.createElement("div");
  counter.textContent = countState.value.data.toString();

  const addButton = document.createElement("button");
  addButton.textContent = "Add";

  const subtractButton = document.createElement("button");
  subtractButton.textContent = "Subtract";

  const handleAdd = () => {
    countAction.add();
    counter.textContent = countState.value.data.toString();
  };
  addButton.addEventListener("click", handleAdd);

  const handleSubtract = () => {
    countAction.subtract();
    counter.textContent = countState.value.data.toString();
  };
  subtractButton.addEventListener("click", handleSubtract);

  const uiFragment = document.createDocumentFragment();
  uiFragment.appendChild(counter);
  uiFragment.appendChild(addButton);
  uiFragment.appendChild(subtractButton);

  app.appendChild(uiFragment);

  subscribe(countState, () => {
    console.log("countState changed");
    console.log(JSON.stringify(countState));
  });
};

void main();
