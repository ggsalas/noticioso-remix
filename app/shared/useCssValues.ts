import { useCallback, useState } from "react";

export type GetVar = (varName: string, defaultValue?: string) => string;

/**
 * Get CSS Variables from a DOM element
 *
 * Use "getCSS" function after "styles" is set.
 */
export const useCssValues = <T extends Element | null>() => {
  const [styles, setStyles] = useState<CSSStyleDeclaration | null>(null);
  const [element, setElement] = useState<T | null>(null);

  const ref = useCallback((node: T) => {
    if (node !== null) {
      setStyles(window.getComputedStyle(node as Element));
      setElement(node);
    }
  }, []);

  const getCSS = (varName: string, defaultValue?: string) => {
    if (!styles && !defaultValue) {
      throw new Error(
        "Error in useCssVars: 'getCSS' function is called before 'styles' is resolved. Also, there is no default value for styles."
      );
    }

    if (!styles) {
      console.error(
        "Error in useCssVars: 'getCSS' function is called before 'styles' is resolved"
      );

      return defaultValue ?? "";
    }

    return styles.getPropertyValue(varName).trim();
  };

  return { ref, element, styles, getCSS };
};
