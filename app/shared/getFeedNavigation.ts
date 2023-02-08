import type { Feed } from "~/types";

export function getFeedNavigation({
  feedUrl,
  feedsTxt,
}: {
  feedUrl: string | null;
  feedsTxt: string | null;
}) {
  if (!feedUrl || !feedsTxt)
    return {
      nextUrl: "#",
      prevUrl: "#",
      feedPageUrl: "#",
    };

  // Get feed list and create urls for next and previous feed
  const feeds = feedsTxt ? JSON.parse(feedsTxt) : null;
  const getFeedUrl = (feedUrl: string) =>
    `/feeds/${encodeURIComponent(feedUrl)}`;

  const currentFeedIndex = feeds.findIndex(
    (feed: Feed) => feed.url === feedUrl
  );
  const nextFeedIndex =
    currentFeedIndex < feeds.length - 1 ? currentFeedIndex + 1 : 0;
  const prevFeedIndex = currentFeedIndex > 0 ? currentFeedIndex - 1 : 0;

  // Go to: scroll -> next feed
  return {
    nextUrl: getFeedUrl(feeds[nextFeedIndex].url),
    prevUrl: getFeedUrl(feeds[prevFeedIndex].url),
  };
}
