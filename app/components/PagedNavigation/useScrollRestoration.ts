import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { exists } from "~/shared/common";

const maxAge = 60 * 50; // 50 minutes.

function isActive(date?: number) {
  if (!date) return false;

  const currentTime = new Date().getTime();
  const scrollTime = new Date(date).getTime();
  const maxAgeTime = new Date(scrollTime + maxAge * 1000).getTime();
  const isActive = maxAgeTime > currentTime;

  return isActive;
}

export function useScrollRestoration({ containerElement, scrollLeft }: any) {
  const location = useLocation();

  // Scroll restoration - on page changes
  // - to  a saved position if is saved before maxAgeTime
  // - to the start (0, 0)
  useEffect(() => {
    const pagesScroll = sessionStorage.getItem(
      `pagedNavigationScroll-${encodeURIComponent(location.pathname)}`
    );
    const { scrollLeft, date } = pagesScroll
      ? JSON.parse(pagesScroll)
      : { scrollLeft: undefined, date: undefined };

    if (containerElement) {
      if (scrollLeft && isActive(date)) {
        containerElement.scrollTo(JSON.parse(scrollLeft), 0);
      } else {
        containerElement.scrollTo(0, 0);
      }
    }
  }, [containerElement, location.pathname]);

  // Scroll restoration - save scroll position for each page
  useEffect(() => {
    if (location.pathname && exists(scrollLeft)) {
      sessionStorage.setItem(
        `pagedNavigationScroll-${encodeURIComponent(location.pathname)}`,
        JSON.stringify({ scrollLeft, date: Date.now() })
      );
    }
  }, [location.pathname, scrollLeft]);
}
