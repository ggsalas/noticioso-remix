import { PrefetchPageLinks, useLoaderData, useParams } from "@remix-run/react";
import Article from "~/components/Article";
import type { LoaderArgs } from "@remix-run/node";
import ArticleCSS from "~/styles/Article.css";
import { getArticle } from "~/server/getArticle.server";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleNavigation } from "~/components/Article/getArticleNavigation";
import { useGlobalFont } from "~/shared/useGlobalFont";

export function links() {
  return [{ rel: "stylesheet", href: ArticleCSS }];
}

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.articleUrl) return;
  const article = await getArticle(params.articleUrl);

  return article;
};

export default function ArticleUrl() {
  useGlobalFont();
  const article = useLoaderData<typeof loader>();
  let { feedUrl = "", articleUrl = "" } = useParams();
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState<{
    nextUrl?: string;
    prevUrl?: string;
    feedPageUrl: string;
  }>({
    nextUrl: undefined,
    prevUrl: undefined,
    feedPageUrl: "",
  });

  useEffect(() => {
    const articlesTxt = localStorage.getItem(`feedContent-${feedUrl}`);
    const feedsTxt = localStorage.getItem("feeds");
    const navigation = getArticleNavigation({
      feedUrl,
      articleUrl,
      articlesTxt,
      feedsTxt,
    });

    setNavigation(navigation);
  }, [feedUrl, articleUrl]);

  const onGoNextHandler = () =>
    navigation.nextUrl ? navigate(navigation.nextUrl) : null;
  const onGoPrevHandler = () =>
    navigation.prevUrl ? navigate(navigation.prevUrl) : null;
  const onGoToFeed = () => navigate(navigation.feedPageUrl);

  return (
    <main className="Feed">
      {navigation.nextUrl && <PrefetchPageLinks page={navigation.nextUrl} />}
      {navigation.prevUrl && <PrefetchPageLinks page={navigation.prevUrl} />}

      <Article
        content={article}
        onGoNext={onGoNextHandler}
        onGoPrev={onGoPrevHandler}
        onGoToFeed={onGoToFeed}
      />
    </main>
  );
}