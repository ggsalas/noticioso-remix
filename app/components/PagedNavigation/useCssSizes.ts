import { useEffect, useState } from "react";

export function useCssSizes(element: any) {
  const [cssValues, setCssValues] = useState<{
    articleColumnWidth: string;
    articlePadding: string;
    viewportWidth: string;
    viewportHeight: string;
    increment: number;
  }>({
    articleColumnWidth: "0px",
    articlePadding: "0px",
    viewportWidth: "0px",
    viewportHeight: "0px",
    increment: 0,
  });

  useEffect(() => {
    if (element) {
      const elementStyles = window.getComputedStyle(element as Element);
      const getElementValue = (name: string) =>
        elementStyles?.getPropertyValue(name).trim() ?? "noo";

      const body = document.querySelector("body");
      const bodyStyles = body ? window.getComputedStyle(body) : null;
      const getBodyValue = (name: string) =>
        bodyStyles?.getPropertyValue(name).trim() ?? "";

      const articleColumnWidth = getElementValue("width");
      const articlePadding = getElementValue("--articlePadding");
      const viewportWidth = getBodyValue("width");
      const viewportHeight = getBodyValue("height");

      setCssValues({
        articleColumnWidth,
        articlePadding,
        viewportWidth,
        viewportHeight,
        increment: parseInt(articleColumnWidth) + parseInt(articlePadding),
      });
    }
  }, [element]);

  return cssValues;
}
