import type { Readability } from "@mozilla/readability";
import { useRef, useState } from "react";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

interface ArticleProps {
  content: ReadabilityArticle;
  onGoNextItem?: any;
}

const ARTICLE_COLUMN_WIDTH = 600;
const ARTICLE_PADDING = 30;

export default function Article({ content }: ArticleProps) {
  const container = useRef<HTMLElement>(null);
  const [showActions, setShowActions] = useState(false);
  const { title, content: html, siteName } = content as any;

  const handlePageNavigation = (direction: "next" | "back") => () => {
    const containerElement = container.current;
    if (!containerElement) return;

    const scroll = containerElement.scrollLeft;
    const increment = ARTICLE_COLUMN_WIDTH + ARTICLE_PADDING;
    containerElement.scrollTo(
      direction === "next" ? scroll + increment : scroll - increment,
      0
    );
  };

  const toggleActions = () => {
    setShowActions((actions) => !actions);
  };

  return (
    <>
      <style>{` 
        :root { 
          --articleColumnWidth: ${ARTICLE_COLUMN_WIDTH}px; 
          --articlePadding: ${ARTICLE_PADDING}px;
        } 
      `}</style>

      <article className="Article" ref={container}>
        {showActions ? (
          <div className="Article__actions">
            <div className="Article__actions-menu">Menu display</div>
            <div className="Article__actions-home" onClick={toggleActions} />
            <div className="Article__actions-navigation">
              Footer navigation display
            </div>
          </div>
        ) : (
          <div className="Article__interactions">
            <div className="Article__interactions-top" />
            <div className="Article__interactions-center">
              <div
                className="Article__interactions-back"
                onClick={handlePageNavigation("back")}
              />
              <div
                className="Article__interactions-home"
                onClick={toggleActions}
              />
              <div
                className="Article__interactions-next"
                onClick={handlePageNavigation("next")}
              />
            </div>
            <div className="Article__interactions-bottom" />
          </div>
        )}

        <div className="Article__columns">
          <span>{siteName}</span>
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
    </>
  );
}
