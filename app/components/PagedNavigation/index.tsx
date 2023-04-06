import type { ReactElement } from "react";
import { cloneElement, useState } from "react";
import { FontSet } from "../FontSet";
import { usePagedNavigation } from "./usePagedNavigation";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useGesturesNavigation } from "./useGesturesNavigation";
import { useContainerValues } from "./useContainerValues";

interface PagedNavigationProps {
  children: ReactElement;
  onGoNext?: () => void;
  onGoPrev?: () => void;
  onGoToParent?: () => void;
  mode?: "percentage" | "pages";
}

export default function PagedNavigation({
  children,
  onGoNext,
  onGoPrev,
  onGoToParent,
  mode = "percentage",
}: PagedNavigationProps) {
  const [showActions, setShowActions] = useState(false);

  const { containerRef, containerElement, containerValues } =
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
    viewportHeight: containerValues.viewportHeight,
    handlePageNavigation,
    onGoToParent,
    onGoPrev,
    onGoNext,
    toggleActions,
  });

  const totalPagesArray = totalPages > 0 ? Array(totalPages).fill("") : [];

  return (
    <div className="PagedNavigation" id="PagedNavigation">
      <div
        className="PagedNavigationContainer"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {showActions ? (
          <div className="PagedNavigationContainer__actions">
            <div className="PagedNavigationContainer__actions-menu">
              <div className="PagedNavigationContainer__actions-menuBar">
                {onGoToParent ? (
                  <button onClick={onGoToParent}>{`< Back`}</button>
                ) : (
                  <div />
                )}
                <FontSet />
              </div>
            </div>
            <div
              className="PagedNavigationContainer__actions-home"
              onClick={toggleActions}
            />
          </div>
        ) : null}

        <div className="PagedNavigationContainer__columns">
          {cloneElement(children, { ref: contentRef })}
        </div>
      </div>

      <div className="PagedNavigationContainer__footer">
        {mode === "pages" ? (
          <>
            <div className="PagedNavigationContainer__footerInfo">
              {`página ${page}`}
            </div>
            <div className="PagedNavigationContainer__readPages">
              {totalPagesArray.map((_, i) => (
                <div
                  key={i}
                  className={
                    i + 1 === page
                      ? "PagedNavigationContainer__page-current"
                      : "PagedNavigationContainer__page"
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="PagedNavigationContainer__footerInfo">
              {readPercentage}%
            </div>
            <div className="PagedNavigationContainer__readPercentage">
              <div
                className="PagedNavigationContainer__readPercentageBar"
                style={{ width: `${readPercentage}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
