import type { ReactElement } from "react";
import { cloneElement, useState } from "react";
import useViewportDimensions from "~/shared/useViewportDimensions";
import { FontSet } from "../FontSet";
import { usePagedNavigation } from "./usePagedNavigation";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useGesturesNavigation } from "./useGesturesNavigation";

interface PagedNavigationProps {
  children: ReactElement;
  onGoNext?: () => void;
  onGoPrev?: () => void;
  onGoToParent?: () => void;
}

const DESIRED_ARTICLE_COLUMN_WIDTH = 600;
const ARTICLE_PADDING = 24;

export default function PagedNavigation({
  children,
  onGoNext,
  onGoPrev,
  onGoToParent,
}: PagedNavigationProps) {
  const [showActions, setShowActions] = useState(false);
  const { viewportWidth, viewportHeight } = useViewportDimensions();
  const articleColumnWidth = !viewportWidth
    ? DESIRED_ARTICLE_COLUMN_WIDTH // on server render for now
    : viewportWidth > DESIRED_ARTICLE_COLUMN_WIDTH + ARTICLE_PADDING * 2
    ? DESIRED_ARTICLE_COLUMN_WIDTH
    : viewportWidth - ARTICLE_PADDING * 2;
  const increment = articleColumnWidth + ARTICLE_PADDING;

  const {
    handleScroll,
    readPercentage,
    containerRef,
    contentRef,
    handlePageNavigation,
  } = usePagedNavigation({
    increment,
    onGoNext,
    onGoPrev,
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

  return (
    <div className="PagedNavigation" id="PagedNavigation">
      <style>{` 
        :root { 
          --articleColumnWidth: ${articleColumnWidth}px; 
          --articlePadding: ${ARTICLE_PADDING}px;
          /* --mobileViewportHeight: ${viewportHeight}px;  fix undefined initial value */
        } 
      `}</style>

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
        {/* ) : (
          <div className="PagedNavigationContainer__interactions">
            <div
              className="PagedNavigationContainer__interactions-top"
              onClick={toggleActions}
            />
            <div className="PagedNavigationContainer__interactions-center">
              <div
                className="PagedNavigationContainer__interactions-back"
                onClick={handlePageNavigation("back")}
              />
              <div
                className="PagedNavigationContainer__interactions-next"
                onClick={handlePageNavigation("next")}
              />
            </div>
            <div className="PagedNavigationContainer__interactions-bottom">
              <div
                className="PagedNavigationContainer__interactions-bottom-back"
                onClick={onGoPrev}
              />
              <div
                className="PagedNavigationContainer__interactions-bottom-next"
                onClick={onGoNext}
              />
            </div>
          </div> 
        )}*/}

        <div className="PagedNavigationContainer__columns">
          {cloneElement(children, { ref: contentRef })}
        </div>
      </div>

      <div className="PagedNavigationContainer__footer">
        <div className="PagedNavigationContainer__footerInfo">
          {readPercentage}%
        </div>
        <div className="PagedNavigationContainer__readPercentage">
          <div
            className="PagedNavigationContainer__readPercentageBar"
            style={{ width: `${readPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
