import { useEffect, useLayoutEffect, useState } from "react";

export function useGlobalFont() {
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const fontSizeLS = localStorage.getItem(`globalFontSize`);
    const fontSize = fontSizeLS && JSON.parse(fontSizeLS);

    setFontSize(fontSize);
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
