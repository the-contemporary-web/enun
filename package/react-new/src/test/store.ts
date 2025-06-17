import { state } from "@enun/state";

const getCountAfterDelay = (delay: number) => {
  const countPromise = new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(0);
    }, delay);
  });
  return countPromise;
};

type CountState = {
  name: string;
  data: number;
  add: () => void;
  subtract: () => void;
};

const CountState = state<CountState, [number]>()({
  as: id => id,
  is: async ({ set }, id) => {
    const name = `Count-${id.toString()}`;
    const data = await getCountAfterDelay(2000);

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
      name,
      data,
      add,
      subtract,
    };
  },
});

export { CountState };
