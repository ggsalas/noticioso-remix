import { useEffect, useLayoutEffect, useState } from "react";

export function useSetLanguage(language?: string) {
  useLayoutEffect(() => {
    const html = document.querySelector("html");

    console.log(html, language);
    language && html?.setAttribute("lang", language);
  }, [language]);
}
