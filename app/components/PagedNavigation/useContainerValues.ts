import { useEffect, useRef, useState } from "react";
import { exists } from "~/shared/common";

type ContainerValues = {
  articleColumnWidth: string;
  articlePadding: string;
  viewportWidth?: number;
  viewportHeight?: number;
  increment: number;
};

function getValue(name: string, elementStyles: CSSStyleDeclaration | null) {
  return elementStyles?.getPropertyValue(name)?.trim() ?? "";
}

export function useContainerValues() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerElement = containerRef.current;
  const [containerValues, setContainerValues] = useState<ContainerValues>({
    articleColumnWidth: "0px",
    articlePadding: "0px",
    viewportWidth: 0,
    viewportHeight: 0,
    increment: 0,
  });

  // get css values from the DOM
  useEffect(() => {
    if (containerElement) {
      const elementStyles = window.getComputedStyle(
        containerElement as Element
      );

      const articleColumnWidth = getValue("width", elementStyles);
      const articlePadding = getValue("--articlePadding", elementStyles);

      setContainerValues({
        articleColumnWidth,
        articlePadding,
        increment: parseInt(articleColumnWidth) + parseInt(articlePadding),
      });
    }
  }, [containerElement]);

  // get viewport size
  useEffect(() => {
    const node = document.querySelector("body");

    if (node !== null) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];

        const viewportWidth = entry.target.getBoundingClientRect().width;
        const viewportHeight = entry.target.getBoundingClientRect().height;

        exists(viewportWidth) &&
          setContainerValues((st) => ({ ...st, viewportWidth }));
        exists(viewportHeight) &&
          setContainerValues((st) => ({ ...st, viewportHeight }));
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
    containerValues,
  };
}
