import { useEffect, useRef, useState } from "react";

export function exists<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export const useArticleNavigation = ({
  increment,
  gotoNextArticle,
  gotoPreviousArticle,
}: any) => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerElement = containerRef.current;
  const contentElement = contentRef.current;

  const [scrollLeft, setScrollLeft] = useState<number | undefined>();
  const contentWidth = contentElement?.getBoundingClientRect().width;
  const isArticleEnd = Boolean(
    exists(scrollLeft) &&
      exists(contentWidth) &&
      scrollLeft + increment >= contentWidth
  );
  const isArticleStart = Boolean(scrollLeft === 0);
  const read = Math.ceil(
    contentWidth ? ((scrollLeft + increment) / contentWidth) * 100 : 0
  );
  const readPercentage = read > 100 ? 100 : read;

  console.table({
    scrollLeft,
    scrollLeftPlusIncrement: scrollLeft + increment,
    contentWidth,
    isArticleStart,
    isArticleEnd,
  });

  useEffect(() => {
    if (contentElement) setScrollLeft(containerElement?.scrollLeft);
  }, [containerElement]);

  // scrollLeft should be in the state to be updated listening the scroll
  // events of the article element
  const handleScroll = () => {
    setScrollLeft(containerElement?.scrollLeft);
  };

  const handlePageNavigation = (direction: "next" | "back") => () => {
    if (!exists(containerElement) || !exists(scrollLeft)) return;

    switch (direction) {
      case "next":
        return isArticleEnd
          ? gotoNextArticle()
          : containerElement.scrollTo(scrollLeft + increment, 0);
      case "back":
        return isArticleStart
          ? gotoPreviousArticle()
          : containerElement.scrollTo(scrollLeft - increment, 0);
      default:
        throw new Error("Scroll direction not supported");
    }
  };

  return {
    isArticleStart,
    isArticleEnd,
    handleScroll,
    handlePageNavigation,
    readPercentage,
    containerRef,
    contentRef,
    containerElement,
    contentElement,
  };
};
