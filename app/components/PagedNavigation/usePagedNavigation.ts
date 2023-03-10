import { useEffect, useState } from "react";
import { exists } from "~/shared/common";
import { useMeasure } from "~/shared/useMeasure";
import { useScrollRestoration } from "./useScrollRestoration";

export const usePagedNavigation = ({
  onGoNext,
  onGoPrev,
  containerElement,
  containerValues,
}: any) => {
  const [scrollLeft, setScrollLeft] = useState<number | undefined>();
  const { ref: contentRef, width: contentWidth } = useMeasure<HTMLDivElement>([
    "width",
  ]);
  const increment = containerValues.increment;

  useScrollRestoration({ containerElement, scrollLeft });

  useEffect(() => {
    if (containerElement) setScrollLeft(containerElement?.scrollLeft);
  }, [containerElement]);

  // scrollLeft should be in the state to be updated listening the scroll
  // events of the article element
  const handleScroll = () => {
    setScrollLeft(containerElement?.scrollLeft);
  };

  const isArticleEnd = Boolean(
    exists(scrollLeft) &&
      exists(contentWidth) &&
      scrollLeft + increment >= contentWidth
  );
  const isArticleStart = Boolean(scrollLeft === 0);
  const read = Math.ceil(
    contentWidth && exists(scrollLeft)
      ? ((scrollLeft + increment) / contentWidth) * 100
      : 0
  );
  const readPercentage = read > 100 ? 100 : read;

  const handlePageNavigation = (direction: "next" | "back") => () => {
    if (!exists(containerElement) || !exists(scrollLeft)) return;

    switch (direction) {
      case "next":
        return isArticleEnd
          ? onGoNext()
          : containerElement.scrollTo(scrollLeft + increment, 0);
      case "back":
        return isArticleStart
          ? onGoPrev()
          : containerElement.scrollTo(scrollLeft - increment, 0);
      default:
        throw new Error("Scroll direction not supported");
    }
  };

  return {
    handleScroll,
    handlePageNavigation,
    readPercentage,
    contentRef,
  };
};
