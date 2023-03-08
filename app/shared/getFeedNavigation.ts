import type { Feed } from "~/types";

export function getFeedNavigation({
  feedUrl,
  feeds,
}: {
  feedUrl?: string | null;
  feeds?: any;
}) {
  if (!feedUrl || !feeds)
    return {
      nextUrl: "#",
      prevUrl: "#",
      feedPageUrl: "#",
    };

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
    currentFeed: getFeedUrl(feeds[currentFeedIndex].url),
  };
}
