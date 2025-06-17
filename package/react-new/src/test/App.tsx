import { getSubscriptions } from "@enun/state";
import { Suspense, useCallback, useState } from "react";

import { States, useStateOf } from "../../index";
import { CountState } from "./store";

const debugSubscriptions = () => {
  console.log(JSON.stringify(Array.from(getSubscriptions().entries()), null, 2));
};

export const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CounterList />
        <Counter counterId={0} />
      </Suspense>
      <button onClick={debugSubscriptions}>debug subscriptions</button>
    </div>
  );
};

const CounterList = () => {
  const [ids, setIds] = useState([0, 1, 2, 3, 4]);
  const handleIncreaseId = useCallback(() => {
    setIds(prev => {
      const newIds = [...prev].map(id => id + 1);
      return newIds;
    });
  }, []);
  const handleDecreaseId = useCallback(() => {
    setIds(prev => {
      const newIds = [...prev].map(id => id - 1);
      return newIds;
    });
  }, []);

  return (
    <div>
      {ids.map((id, idx) => (
        <CounterItem key={`${id.toString()}_${idx.toString()}`} counterId={id} />
      ))}
      <button onClick={handleIncreaseId}>increase id </button>
      <button onClick={handleDecreaseId}>decrease id </button>
    </div>
  );
};

const CounterItem = ({ counterId }: { counterId: number }) => {
  return (
    <States state={CountState(counterId)}>
      <Counter />
    </States>
  );
};

type CounterProps = {
  counterId?: number;
};
const Counter = ({ counterId }: CounterProps) => {
  const {
    value: { name, data, add, subtract },
  } = useStateOf(counterId !== undefined ? CountState(counterId) : CountState);

  return (
    <div>
      <div>{name}</div>
      <div>{data}</div>
      <button onClick={add}>add</button>
      <button onClick={subtract}>subtract</button>
    </div>
  );
};
