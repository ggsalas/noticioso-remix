import type { Feed } from "~/types";
import { getFeedContent } from "./getFeedContent.server";
import { getFeeds } from "./getFeeds.server";

interface GetNextFeedWithContent {
  feeds: Feed[];
  url: string;
}

interface GetNextFeedUrl {
  feeds: Feed[];
  url: string;
}

export function getNextFeedUrl({ feeds, url }: GetNextFeedUrl) {
  const currentFeedIndex = feeds.findIndex((feed: Feed) => feed.url === url);

  if (currentFeedIndex) {
    const nextFeedIndex =
      currentFeedIndex < feeds.length - 1 ? currentFeedIndex + 1 : 0;

    const nextUrl = feeds[nextFeedIndex].url;
    return nextUrl;
  }
  return "";
}

export async function getNextFeedWithContent({
  feeds,
  url,
}: GetNextFeedWithContent): Promise<string> {
  try {
    const feedContent = await getFeedContent(url);
    const nextUrl = getNextFeedUrl({ feeds, url });
    const content = feedContent.rss.channel.item;

    if (!content.length || content.length === 0) {
      // No content on this feed, try with next url
      return getNextFeedWithContent({ feeds, url: nextUrl });
    } else {
      return `/feeds/${encodeURIComponent(url)}`;
    }
  } catch (e) {
    // If some feed fails, return empty url to prevent go to an error page
    return "";
  }
}

export async function getNextFeedWithContentUrl(url: string) {
  const feeds = await getFeeds();

  return await getNextFeedWithContent({
    feeds,
    url: getNextFeedUrl({ feeds, url }),
  });
}
