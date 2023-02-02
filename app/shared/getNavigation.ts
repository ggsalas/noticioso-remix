import type { Article, Feed } from "~/types";

export function getNavigation({
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

  // Go to: scroll -> next article -> next feed
  return {
    nextUrl:
      nextArticleIndex !== false
        ? getArtileUrl(articles[nextArticleIndex].link)
        : nextFeedIndex !== false
        ? getFeedUrl(feeds[nextFeedIndex].url)
        : undefined,
    prevUrl:
      prevArticleIndex !== false
        ? getArtileUrl(articles[prevArticleIndex].link)
        : prevFeedIndex !== false
        ? getFeedUrl(feeds[prevFeedIndex].url)
        : undefined,
    feedPageUrl: getFeedUrl(feeds[currentFeedIndex].url),
  };
}
