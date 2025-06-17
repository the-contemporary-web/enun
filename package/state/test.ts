import { awaitState, debugStateStores, destroy, state } from "./index";

type ID = number;

const getCountAfterDelay = () => Promise.resolve(0);

const DayNumberState = state<number>()({
  is: () => {
    const date = new Date();
    return date.getDay();
  },
});

interface CountState {
  id: ID;
  data: number;
  add: () => void;
  subtract: () => void;
}

const CountState = state<CountState, [ID]>()({
  as: (id: ID) => id,
  is: async ({ set, compose }, id) => {
    const dayNumberState = await compose(DayNumberState());

    const data = await getCountAfterDelay().then(data => {
      return data + dayNumberState.value;
    });

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
      id,
      data,
      add,
      subtract,
    };
  },
});

const createCounter = async (id: number) => {
  const countState = await awaitState(CountState(id));
  const counter = document.createElement("div");
  counter.textContent = countState.value.data.toString();

  const addButton = document.createElement("button");
  const handleAdd = () => {
    countState.value.add();
    counter.textContent = countState.value.data.toString();
  };
  addButton.textContent = "Add";
  addButton.addEventListener("click", handleAdd);

  const subtractButton = document.createElement("button");
  const handleSubtract = () => {
    countState.value.subtract();
    counter.textContent = countState.value.data.toString();
  };
  subtractButton.textContent = "Subtract";
  subtractButton.addEventListener("click", handleSubtract);

  const destroyButton = document.createElement("button");
  const handleDestroy = () => {
    destroy(countState);
  };
  destroyButton.textContent = "Destroy";
  destroyButton.addEventListener("click", handleDestroy);

  const uiFragment = document.createDocumentFragment();
  uiFragment.appendChild(counter);
  uiFragment.appendChild(addButton);
  uiFragment.appendChild(subtractButton);
  uiFragment.appendChild(destroyButton);

  return uiFragment;
};

const createDebugButton = () => {
  const debugButtonWrapper = document.createElement("div");

  const debugButton = document.createElement("button");
  const handleDebug = () => {
    console.log(debugStateStores());
  };

  debugButton.addEventListener("click", handleDebug);
  debugButton.textContent = "Debug";

  debugButtonWrapper.appendChild(debugButton);
  return debugButtonWrapper;
};

const main = async () => {
  const app = document.getElementById("app");
  if (!app) throw new Error("App not found");

  const counterIds = [1, 2, 3];
  const counters = await Promise.all(counterIds.map(createCounter));

  const debugButton = createDebugButton();

  const mainUiFragment = document.createDocumentFragment();
  counters.forEach(counter => {
    mainUiFragment.appendChild(counter);
  });
  mainUiFragment.appendChild(debugButton);

  app.appendChild(mainUiFragment);
};

void main();
