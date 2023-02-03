import { useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function PageLoading() {
  const transition = useTransition();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const myInterval = setInterval(() => {
      setPercentage((prevTime) =>
        prevTime === 0 ? 10 : prevTime + (100 - prevTime) / 5
      );
    }, 300);

    if (transition.state === "idle" || percentage >= 100) {
      clearInterval(myInterval);
    }

    return () => clearInterval(myInterval);
  }, [percentage, transition.state]);

  useEffect(() => {
    if (transition.state !== "idle") setPercentage(0);
  }, [transition.state]);

  // show only if takes time to load
  if (transition.state === "idle" || percentage < 50) return null;

  return (
    <div className="PageLoading">
      <div className="PageLoading__bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}
