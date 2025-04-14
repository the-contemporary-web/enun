import { useTest } from "module/useTest";

export const App = () => {
  const { test } = useTest();
  test();

  return <div>@enun/react</div>;
};
