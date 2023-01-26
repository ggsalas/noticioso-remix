import type { Readability } from "@mozilla/readability";
import { useState } from "react";
import useViewportDimensions from "~/shared/useViewportDimensions";
import { useArticleNavigation } from "./useArticleNavigation";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

interface ArticleProps {
  content: ReadabilityArticle;
  onGoNext?: () => void;
  onGoPrev?: () => void;
  onGoToFeed?: () => void;
}

const DESIRED_ARTICLE_COLUMN_WIDTH = 600;
const ARTICLE_PADDING = 30;

export default function Article({
  content,
  onGoNext,
  onGoPrev,
  onGoToFeed,
}: ArticleProps) {
  const [showActions, setShowActions] = useState(false);
  const { title, content: html, siteName } = content as any;
  const { viewportWidth } = useViewportDimensions();
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
  } = useArticleNavigation({
    increment,
    gotoNextArticle: onGoNext,
    gotoPreviousArticle: onGoPrev,
  });

  const toggleActions = () => {
    setShowActions((actions) => !actions);
  };

  return (
    <div className="ArticleContainer">
      <style>{` 
        :root { 
          --articleColumnWidth: ${articleColumnWidth}px; 
          --articlePadding: ${ARTICLE_PADDING}px;
        } 
      `}</style>

      <article className="Article" ref={containerRef} onScroll={handleScroll}>
        {showActions ? (
          <div className="Article__actions">
            <div className="Article__actions-menu">
              <button onClick={onGoToFeed}>{`< Back`}</button>
            </div>
            <div className="Article__actions-home" onClick={toggleActions} />
            <div className="Article__actions-navigation">
              Footer navigation display
            </div>
          </div>
        ) : (
          <div className="Article__interactions">
            <div
              className="Article__interactions-top"
              onClick={toggleActions}
            />
            <div className="Article__interactions-center">
              <div
                className="Article__interactions-back"
                onClick={handlePageNavigation("back")}
              />
              <div
                className="Article__interactions-next"
                onClick={handlePageNavigation("next")}
              />
            </div>
            <div className="Article__interactions-bottom">
              <div
                className="Article__interactions-bottom-back"
                onClick={onGoPrev}
              />
              <div
                className="Article__interactions-bottom-next"
                onClick={onGoNext}
              />
            </div>
          </div>
        )}

        <div className="Article__columns">
          <span>{siteName}</span>
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} ref={contentRef} />
        </div>
      </article>

      <div className="Article__footer">
        <div className="Article__footerInfo">{readPercentage}%</div>
        <div className="Article__readPercentage">
          <div
            className="Article__readPercentageBar"
            style={{ width: `${readPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
