import { useLayoutEffect, useRef, useState } from "react";
import { exists } from "~/shared/common";
import { useMeasure } from "~/shared/useMeasure";

export const useArticleNavigation = ({
  content,
  increment,
  gotoNextArticle,
  gotoPreviousArticle,
}: any) => {
  const containerRef = useRef<HTMLElement>(null);
  const { ref: contentRef, width: contentWidth } = useMeasure<HTMLDivElement>([
    "width",
  ]);
  const containerElement = containerRef.current;

  const [scrollLeft, setScrollLeft] = useState<number | undefined>();
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

  useLayoutEffect(() => {
    if (containerElement) setScrollLeft(containerElement?.scrollLeft);
  }, [containerElement]);

  // if content changes, reset scroll
  // TODO: save each url scroll (default 0)
  useLayoutEffect(() => {
    containerElement && containerElement.scrollTo(0, 0);
  }, [containerElement, content]);

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
  };
};
