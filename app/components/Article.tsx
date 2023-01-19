import type { Readability } from "@mozilla/readability";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

interface ArticleProps {
  content: ReadabilityArticle;
  onGoNextItem?: any;
}

export default function Article({ content }: ArticleProps) {
  const { title, content: html, siteName } = content;

  return (
    <article className="Article">
      <div className="Article__columns">
        <span>{siteName}</span>
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
