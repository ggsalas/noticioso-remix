import { useLoaderData, useParams } from "@remix-run/react";
import Article from "~/components/Article";
import type { LoaderArgs } from "@remix-run/node";
import ArticleCSS from "~/styles/Article.css";
import { getArticle } from "~/models/article.server";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-redeclare
type Article = any; // TODO update this
type Feed = any; // TODO update this

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
    const navigation = getNavigation({
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
      <Article
        content={article}
        onGoNext={onGoNextHandler}
        onGoPrev={onGoPrevHandler}
        onGoToFeed={onGoToFeed}
      />
    </main>
  );
}

function getNavigation({
  feedUrl,
  articleUrl,
  articlesTxt,
  feedsTxt,
}: {
  feedUrl: string | null;
  articleUrl: string | null;
  articlesTxt: string | null;
  feedsTxt: string | null;
}) {
  if (!feedUrl || !articleUrl || !feedsTxt || !articlesTxt)
    return {
      nextUrl: "#",
      prevUrl: "#",
      feedPageUrl: "#",
    };

  // Get article list and create urls for next and previous article
  const articles = articlesTxt ? JSON.parse(articlesTxt) : null;
  const getArtileUrl = (articleUrl: string) =>
    `/feeds/${encodeURIComponent(feedUrl)}/${encodeURIComponent(articleUrl)}`;

  const currentArticleIndex = articles.findIndex(
    (article: Article) => article.link === articleUrl
  );
  const nextArticleIndex =
    currentArticleIndex < articles.length - 1 ? currentArticleIndex + 1 : false;
  const prevArticleIndex =
    currentArticleIndex > 0 ? currentArticleIndex - 1 : false;

  // Get feed list and create urls for next and previous feed
  const feeds = feedsTxt ? JSON.parse(feedsTxt) : null;
  const getFeedUrl = (feedUrl: string) =>
    `/feeds/${encodeURIComponent(feedUrl)}`;

  const currentFeedIndex = feeds.findIndex(
    (feed: Feed) => feed.url === feedUrl
  );
  const nextFeedIndex =
    currentFeedIndex < feeds.length - 1 ? currentFeedIndex + 1 : false;
  const prevFeedIndex = currentFeedIndex > 0 ? currentFeedIndex - 1 : false;

  return {
    nextUrl: nextArticleIndex
      ? getArtileUrl(articles[nextArticleIndex].link)
      : nextFeedIndex
      ? getFeedUrl(feeds[nextFeedIndex].url)
      : undefined,
    prevUrl: prevArticleIndex
      ? getArtileUrl(articles[prevArticleIndex].link)
      : prevFeedIndex
      ? getFeedUrl(feeds[prevFeedIndex].url)
      : undefined,
    feedPageUrl: getFeedUrl(feeds[currentFeedIndex].url),
  };
}
