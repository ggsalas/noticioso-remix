import type { ReactElement } from "react";
import { cloneElement, useState } from "react";
import { usePagedNavigation } from "./usePagedNavigation";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useGesturesNavigation } from "./useGesturesNavigation";
import { useContainerValues } from "./useContainerValues";
import Actions from "./Actions";

type FooterProps = {
  totalPagesArray: string[];
  page: number;
  readPercentage: number;
};

type HeaderProps = {
  page: number;
};

interface PagedNavigationProps {
  children: ReactElement;
  onGoNext?: () => void;
  onGoPrev?: () => void;
  onGoToParent?: () => void;
  onEndOfNavigation?: () => void;
  footer?: (props: FooterProps) => ReactElement;
  header?: (props: HeaderProps) => ReactElement;
}

export default function PagedNavigation({
  children,
  onGoNext,
  onGoPrev,
  onGoToParent,
  onEndOfNavigation,
  footer,
  header,
}: PagedNavigationProps) {
  const [showActions, setShowActions] = useState(false);

  const { containerRef, containerElement, containerValues, styles } =
    useContainerValues();

  const {
    handleScroll,
    readPercentage,
    contentRef,
    handlePageNavigation,
    page,
    totalPages,
  } = usePagedNavigation({
    onGoNext,
    onGoPrev,
    onGoToParent,
    onEndOfNavigation,
    containerElement,
    containerValues,
  });

  const toggleActions = () => {
    setShowActions((actions) => !actions);
  };

  useKeyboardNavigation({
    handlePageNavigation,
    onGoToParent,
    onGoPrev,
    onGoNext,
    toggleActions,
  });

  useGesturesNavigation({
    handlePageNavigation,
    onGoToParent,
    onGoPrev,
    onGoNext,
    toggleActions,
  });

  const totalPagesArray = totalPages > 0 ? Array(totalPages).fill("") : [];

  return (
    <div className="PagedNavigation" id="PagedNavigation">
      <>
        {header && <div>{header({ page })}</div>}

        <div
          className="PagedNavigation__container"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {styles && (
            <>
              {showActions ? (
                <Actions {...{ onGoToParent, toggleActions }} />
              ) : null}
              <div className="PagedNavigation__columns">
                {cloneElement(children, { ref: contentRef })}
              </div>
            </>
          )}
        </div>

        {footer && (
          <div className="PagedNavigation__footer">
            {footer({ totalPagesArray, page, readPercentage })}
          </div>
        )}
      </>
    </div>
  );
}
