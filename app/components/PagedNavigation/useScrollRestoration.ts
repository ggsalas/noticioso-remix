import { useLocation } from "@remix-run/react";
import { useEffect, useLayoutEffect } from "react";
import { exists } from "~/shared/common";

export function useScrollRestoration({ containerElement, scrollLeft }: any) {
  const location = useLocation();

  // Scroll restoration - on page changes
  // - to  a saved position
  // - to the start (0, 0)
  useLayoutEffect(() => {
    const pagesScroll = localStorage.getItem(
      `pagedNavigationScroll-${encodeURIComponent(location.pathname)}`
    );

    if (containerElement) {
      if (exists(pagesScroll)) {
        containerElement.scrollTo(JSON.parse(pagesScroll), 0);
      } else {
        containerElement.scrollTo(0, 0);
      }
    }
  }, [containerElement, location.pathname]);

  // Scroll restoration - save scroll position for each page
  useEffect(() => {
    if (location.pathname && exists(scrollLeft)) {
      localStorage.setItem(
        `pagedNavigationScroll-${encodeURIComponent(location.pathname)}`,
        JSON.stringify(scrollLeft)
      );
    }
  }, [location.pathname, scrollLeft]);
}
