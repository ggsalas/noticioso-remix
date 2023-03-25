import { PrefetchPageLinks, useLoaderData, useParams } from "@remix-run/react";
import PagedNavigation from "~/components/PagedNavigation";
import PagedNavigationStyles from "~/styles/PagedNavigation.css";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import ArticleCSS from "~/styles/Article.css";
import { getArticle } from "~/server/getArticle.server";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleNavigation } from "~/shared/getArticleNavigation";
import { useGlobalFont } from "~/shared/useGlobalFont";
import type { Readability } from "@mozilla/readability";
import { getFeeds } from "~/server/getFeeds.server";
import { getFeedNavigation } from "~/shared/getFeedNavigation";

export function links() {
  return [
    { rel: "stylesheet", href: ArticleCSS },
    { rel: "stylesheet", href: PagedNavigationStyles },
  ];
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

type LoaderData = Awaited<{
  article: ReturnType<Readability["parse"]>;
  lang?: string;
  feedsNavigation: any;
}>;

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.articleUrl) return;
  const article = await getArticle(params.articleUrl);
  const feeds = await getFeeds();
  const navigation = getFeedNavigation({
    feedUrl: params.feedUrl,
    feeds,
  });

  const feed = feeds.find((f) => f.url === params.feedUrl);

  let headers = {
    "Cache-Control": "max-age=86400", // 1 day
  };

  return json<LoaderData>(
    { article, lang: feed?.lang, feedsNavigation: navigation },
    { headers }
  );
};

export default function ArticleUrl() {
  useGlobalFont();
  const { article, lang, feedsNavigation } = useLoaderData();
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
    const navigation = getArticleNavigation({
      feedUrl,
      articleUrl,
      articlesTxt,
      feedsNavigation,
    });

    setNavigation(navigation);
  }, [feedUrl, articleUrl, feedsNavigation]);

  const onGoNextHandler = () =>
    navigation.nextUrl ? navigate(navigation.nextUrl) : null;
  const onGoPrevHandler = () =>
    navigation.prevUrl ? navigate(navigation.prevUrl) : null;
  const onGoToFeed = () => navigate(navigation.feedPageUrl);

  if (!article) return null;

  return (
    <main className="Feed" lang={lang}>
      {navigation.nextUrl && <PrefetchPageLinks page={navigation.nextUrl} />}
      {navigation.prevUrl && <PrefetchPageLinks page={navigation.prevUrl} />}

      <div className="Article__siteName">
        {article?.siteName} · {article.title}
      </div>

      <PagedNavigation
        onGoNext={onGoNextHandler}
        onGoPrev={onGoPrevHandler}
        onGoToParent={onGoToFeed}
      >
        <article className="Article">
          <h1>{article?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </PagedNavigation>
    </main>
  );
}
