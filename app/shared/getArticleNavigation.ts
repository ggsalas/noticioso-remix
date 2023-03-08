import type { Article, Feed } from "~/types";

export function getArticleNavigation({
  feedUrl,
  articleUrl,
  articlesTxt,
  feedsNavigation,
}: {
  feedUrl: string | null;
  articleUrl: string | null;
  articlesTxt: string | null;
  feedsNavigation: any;
}) {
  if (!feedUrl || !articleUrl || !feedsNavigation || !articlesTxt)
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

  // Go to: scroll -> next article -> next feed
  return {
    nextUrl:
      nextArticleIndex !== false
        ? getArtileUrl(articles[nextArticleIndex].link)
        : feedsNavigation.nextUrl,
    prevUrl:
      prevArticleIndex !== false
        ? getArtileUrl(articles[prevArticleIndex].link)
        : feedsNavigation.prevUrl,
    feedPageUrl: feedsNavigation.currentFeed,
  };
}
