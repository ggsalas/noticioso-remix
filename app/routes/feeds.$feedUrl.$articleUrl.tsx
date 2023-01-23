import { useLoaderData, useParams } from "@remix-run/react";
import Article from "~/components/Article";
import type { LoaderArgs } from "@remix-run/node";
import ArticleCSS from "~/styles/Article.css";
import { getArticle } from "~/models/article.server";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-redeclare
type Article = any; // TODO update this

export function links() {
  return [{ rel: "stylesheet", href: ArticleCSS }];
}

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.articleUrl) return;
  const article = await getArticle(params.articleUrl);

  return article;
};

export default function ArticleUrl() {
  const article = useLoaderData<typeof loader>();
  let { feedUrl = "", articleUrl } = useParams();
  const [navigation, setNavigation] = useState<{
    nextUrl?: string;
    prevUrl?: string;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const articlesTxt = localStorage.getItem(`feedContent-${feedUrl}`);
    const articles = articlesTxt ? JSON.parse(articlesTxt) : null;
    const getArtileUrl = (articleUrl: string) =>
      `/feeds/${encodeURIComponent(feedUrl)}/${encodeURIComponent(articleUrl)}`;

    const currentArticleIndex = articles.findIndex(
      (article: Article) => article.link === articleUrl
    );
    const nextIndex =
      currentArticleIndex < articles.length - 1
        ? currentArticleIndex + 1
        : false;
    const prevIndex = currentArticleIndex > 0 ? currentArticleIndex - 1 : false;

    setNavigation({
      nextUrl: nextIndex ? getArtileUrl(articles[nextIndex].link) : undefined,
      prevUrl: prevIndex ? getArtileUrl(articles[prevIndex].link) : undefined,
    });
  }, [articleUrl, feedUrl]);

  const onGoNextHandler = () =>
    navigation.nextUrl ? navigate(navigation.nextUrl) : null;

  const onGoPrevHandler = () =>
    navigation.prevUrl ? navigate(navigation.prevUrl) : null;

  return (
    <main className="Feed">
      <Article
        content={article}
        onGoNext={onGoNextHandler}
        onGoPrev={onGoPrevHandler}
      />
    </main>
  );
}
