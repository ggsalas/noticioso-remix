import {
  Link,
  PrefetchPageLinks,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import PagedNavigation from "~/components/PagedNavigation";
import PagedNavigationStyles from "~/styles/PagedNavigation.css";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import ArticleCSS from "~/styles/Article.css";
import { getArticle } from "~/server/getArticle.server";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getArticleNavigation } from "~/shared/getArticleNavigation";
import { useGlobalFont } from "~/shared/useGlobalFont";
import type { Readability } from "@mozilla/readability";
import { getFeeds } from "~/server/getFeeds.server";
import { getFeedNavigation } from "~/shared/getFeedNavigation";
import type { Feed, Item } from "~/types";
import NavigationBar from "~/components/PagedNavigation/NavigationBar";

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
  feed?: Feed;
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

  const feed: Feed | undefined = feeds.find((f) => f.url === params.feedUrl);

  let headers = {
    "Cache-Control": "private, max-age=86400", // 1 day
  };

  return json<LoaderData>(
    { article, feed, lang: feed?.lang, feedsNavigation: navigation },
    { headers }
  );
};

export default function ArticleUrl() {
  useGlobalFont();
  const { article, feed, lang, feedsNavigation } = useLoaderData();
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
  const [articleItemFromFeed, setArticleItemFromFeed] = useState<
    Item | undefined
  >(undefined);

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

  useEffect(() => {
    const articlesTxt = localStorage.getItem(`feedContent-${feedUrl}`);
    const articles: Item[] = articlesTxt ? JSON.parse(articlesTxt) : null;

    const article = articles.find((article) => article?.link === articleUrl);
    setArticleItemFromFeed(article);
  }, [articleUrl, feedUrl]);

  const onGoNextHandler = () =>
    navigation.nextUrl ? navigate(navigation.nextUrl) : null;
  const onGoPrevHandler = () =>
    navigation.prevUrl ? navigate(navigation.prevUrl) : null;
  const onGoToFeed = () => navigate(navigation.feedPageUrl);

  const formattedDate = articleItemFromFeed?.pubDate
    ? new Date(articleItemFromFeed.pubDate).toLocaleString("es", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "";
  const author = article?.byline || articleItemFromFeed?.author;

  if (!article) return null;

  return (
    <main className="Feed" lang={lang}>
      {navigation.nextUrl && <PrefetchPageLinks page={navigation.nextUrl} />}
      {navigation.prevUrl && <PrefetchPageLinks page={navigation.prevUrl} />}

      <PagedNavigation
        onGoNext={onGoNextHandler}
        onGoPrev={onGoPrevHandler}
        onGoToParent={onGoToFeed}
        onEndOfNavigation={onGoToFeed}
        footer={(props) => <NavigationBar mode="percentage" {...props} />}
        header={({ page }) => (
          <div className="Article__header">
            {page === 1 ? (
              <>
                <span className="Article__siteName">{feed?.name}</span>
                <span>{formattedDate}</span>
              </>
            ) : (
              <span className="Article__siteName">
                {feed?.name} · {article.title}
              </span>
            )}
          </div>
        )}
      >
        <article className="Article">
          <h1 className="Article__title">{article?.title}</h1>
          <p className="Article__subtitle">{author}</p>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </PagedNavigation>
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      <p>Error loading the article page</p>
      <div className="error-container-action">
        <Link to="." reloadDocument>
          Reload
        </Link>
        {" or "}
        <Link to=".." relative="path">
          Go Back
        </Link>
      </div>
    </div>
  );
}
