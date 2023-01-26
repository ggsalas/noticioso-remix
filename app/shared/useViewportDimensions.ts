import { useState, useEffect } from "react";

function getViewportDimensions() {
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  return {
    viewportWidth,
    viewportHeight,
  };
}

export default function useViewportDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<{
    viewportWidth: number | null;
    viewportHeight: number | null;
  }>({
    viewportWidth: null,
    viewportHeight: null,
  });

  useEffect(() => {
    if (window) {
      function handleResize() {
        setWindowDimensions(getViewportDimensions());
      }
      handleResize(); // set for first time in client

      // // TODO add event listener for this and also for update article columns
      // window.addEventListener("resize", handleResize);
      // return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowDimensions;
}
