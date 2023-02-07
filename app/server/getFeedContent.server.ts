import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

type Item = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  author?: string;
  /* guid
   *
   * media:description
   * media:credit
   * content:encoded
   */
};

export async function getFeedContent(url: string) {
  try {
    const res = await axios.get(url, { responseType: "text" });
    const parser = new XMLParser();
    let feed = parser.parse(res.data);
    const today = new Date();
    today.setHours(0, 0, 0);

    const items = feed.rss.channel.item
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
        const itemDate = new Date(Date.parse(item.pubDate)); // is converted to Arg Standard Time
        const isFromToday = itemDate.getTime() > today.getTime();

        return isFromToday;
      });

    feed.rss.channel.item = items;
    return feed;
  } catch (error) {
    throw new Error(`Error on get feeds: ${error}`);
  }
}
