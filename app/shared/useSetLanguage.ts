import { useEffect } from "react";

export function useSetLanguage(language?: string) {
  useEffect(() => {
    const html = document.querySelector("html");

    language && html?.setAttribute("lang", language);
  }, [language]);
}
