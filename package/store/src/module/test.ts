const test = () => {
  console.log("TEST");
};

type Test = {
  test: () => void;
};

export { test };
export type { Test };
