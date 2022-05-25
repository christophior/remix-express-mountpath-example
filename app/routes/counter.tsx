import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <div>
      <h1>counter example</h1>
      <button onClick={increment}>increment: {count}</button>
    </div>
  );
}
