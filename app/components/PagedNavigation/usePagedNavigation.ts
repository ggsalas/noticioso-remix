import { useEffect, useState } from "react";
import { exists } from "~/shared/common";
import { useMeasure } from "~/shared/useMeasure";
import { useScrollRestoration } from "./useScrollRestoration";

export const usePagedNavigation = ({
  onGoNext,
  onGoPrev,
  onGoToParent,
  onEndOfNavigation,
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

  const totalPages = contentWidth ? Math.ceil(contentWidth / increment) : 1;
  const page = Math.floor((totalPages * readPercentage) / 100);

  const handlePageNavigation = (direction: "next" | "back") => () => {
    if (!exists(containerElement) || !exists(scrollLeft)) return;

    switch (direction) {
      case "next":
        return isArticleEnd
          ? onEndOfNavigation()
          : containerElement.scrollTo(page * increment, 0);
      case "back":
        return isArticleStart
          ? onGoPrev()
          : containerElement.scrollTo((page - 2) * increment, 0);
      default:
        throw new Error("Scroll direction not supported");
    }
  };

  return {
    handleScroll,
    handlePageNavigation,
    readPercentage,
    totalPages,
    page,
    contentRef,
  };
};
