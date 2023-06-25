import { useState } from "preact/hooks";
import type { FunctionComponent } from "preact";

type CounterProps = {
  initialCount: number;
};

export const Counter: FunctionComponent<CounterProps> = ({ initialCount }) => {
  const [count] = useState(initialCount);

  return <div className="bg-red-400 text-white">count: {count}</div>;
};
