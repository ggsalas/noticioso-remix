import { useEffect, useLayoutEffect, useState } from "react";

const DEFAULT_FONT_SIZE = 16;

export function useGlobalFont() {
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const fontSizeLS = localStorage.getItem(`globalFontSize`);
    const fontSize = fontSizeLS && JSON.parse(fontSizeLS);

    setFontSize(fontSize || DEFAULT_FONT_SIZE);
  }, []);

  useEffect(() => {
    if (fontSize !== null) {
      localStorage.setItem("globalFontSize", fontSize.toString());

      let htmlElement: HTMLElement | null = document.querySelector("html");
      if (htmlElement) htmlElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  return { fontSize, setFontSize };
}
