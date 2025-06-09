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
};

const CountState = state<CountState, [number]>()({
  is: async id => {
    const name = `Count-${id.toString()}`;
    const data = await getCountAfterDelay(2000);
    return {
      name,
      data,
    };
  },
  as: id => id,
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

export { CountState };
