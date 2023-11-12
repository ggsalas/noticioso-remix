import { XMLParser } from "fast-xml-parser";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { getFeedByUrl } from "./getFeeds.server";
import type { FeedData, Item } from "~/types";

export async function getFeedContent(url: string): Promise<FeedData> {
  try {
    const feed = await getFeedByUrl(url);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Error on get feeds: ${res}`);
    }
    const data = await res.text();

    const parser = new XMLParser();
    let feedContent: FeedData = parser.parse(data);
    const currentTime = new Date().getTime();
    const date24HoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000);
    const date7daysAgo = new Date(currentTime - 24 * 60 * 60 * 1000 * 7);

    const items = feedContent.rss.channel.item
      // Get description as plain text
      ?.map((item: Item) => {
        const window = new JSDOM("").window;
        const DOMPurify = createDOMPurify(window);
        const description = DOMPurify.sanitize(item.description, {
          ALLOWED_TAGS: ["#text"],
          KEEP_CONTENT: false,
        });
        return { ...item, description };
     })
      // Get only news from today
      .filter((item: Item) => {
        const itemDate = new Date(Date.parse(item.pubDate));
        const isFromLast24Hs = itemDate.getTime() > date24HoursAgo.getTime();
        const isFromLast7days = itemDate.getTime() > date7daysAgo.getTime();

        return feed?.oldestArticle === 7 ? isFromLast7days : isFromLast24Hs;
      });

    feedContent.rss.channel.item = items;
    feedContent.date = new Date();
    return feedContent;
  } catch (error) {
    throw new Error(`Error on get feeds: ${error}`);
  }
}
