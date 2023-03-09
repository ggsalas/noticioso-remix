import { useEffect, useRef, useState } from "react";

type ContainerValues = {
  articleColumnWidth: string;
  articlePadding: string;
  viewportWidth: string;
  viewportHeight: string;
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
    viewportWidth: "0px",
    viewportHeight: "0px",
    increment: 0,
  });

  useEffect(() => {
    if (containerElement) {
      const elementStyles = window.getComputedStyle(
        containerElement as Element
      );
      const body = document.querySelector("body");
      const bodyStyles = body ? window.getComputedStyle(body) : null;

      const articleColumnWidth = getValue("width", elementStyles);
      const articlePadding = getValue("--articlePadding", elementStyles);
      const viewportWidth = getValue("width", bodyStyles);
      const viewportHeight = getValue("height", bodyStyles);

      setContainerValues({
        articleColumnWidth,
        articlePadding,
        viewportWidth,
        viewportHeight,
        increment: parseInt(articleColumnWidth) + parseInt(articlePadding),
      });
    }
  }, [containerElement]);

  return {
    containerRef,
    containerElement,
    containerValues,
  };
}
