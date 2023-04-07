import { useEffect, useMemo, useState } from "react";
import { exists } from "~/shared/common";
import { useCssValues } from "~/shared/useCssValues";

export function useContainerValues() {
  const {
    ref: containerRef,
    element: containerElement,
    styles,
    getCSS,
  } = useCssValues();

  const [viewportValues, setViewportValues] = useState({
    viewportWidth: 0,
    viewportHeight: 0,
  });

  const articleValues = useMemo(() => {
    if (styles) {
      const articleColumnWidth = getCSS("width");
      console.log({
        articleColumnWidth,
        parsed: parseFloat(articleColumnWidth),
      });
      const articlePadding = getCSS("--articlePadding");

      return {
        articleColumnWidth,
        articlePadding,
        increment: parseFloat(articleColumnWidth) + parseFloat(articlePadding),
      };
    }
  }, [getCSS, styles]);

  // get viewport size
  useEffect(() => {
    const node = document.querySelector("body");

    if (node !== null) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];

        const viewportWidth = entry.target.getBoundingClientRect().width;
        const viewportHeight = entry.target.getBoundingClientRect().height;

        exists(viewportWidth) &&
          setViewportValues((st) => ({ ...st, viewportWidth }));
        exists(viewportHeight) &&
          setViewportValues((st) => ({ ...st, viewportHeight }));
      });

      resizeObserver.observe(node);

      return () => {
        resizeObserver.unobserve(node);
      };
    }
  }, []);

  return {
    containerRef,
    containerElement,
    containerValues: {
      ...viewportValues,
      ...articleValues,
    },
    styles,
  };
}
