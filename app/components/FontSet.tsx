import { useGlobalFont } from "~/shared/useGlobalFont";

export function FontSet() {
  const { fontSize, setFontSize } = useGlobalFont();

  const increment = () => setFontSize((size) => Number(size) + 1);
  const decrement = () => setFontSize((size) => Number(size) - 1);

  return (
    <div className="FontSet">
      <button onClick={decrement}>-</button>
      <span>{fontSize}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
