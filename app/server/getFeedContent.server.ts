import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export async function getFeedContent(url: string) {
  try {
    const res = await axios.get(url, { responseType: "text" });

    const parser = new XMLParser();
    let feed = parser.parse(res.data);

    const items = feed.rss.channel.item?.map((item: any) => {
      const window = new JSDOM("").window;
      const DOMPurify = createDOMPurify(window);
      const description = DOMPurify.sanitize(item.description, {
        ALLOWED_TAGS: ["#text"],
        KEEP_CONTENT: false,
      });

      return { ...item, description };
    });

    feed.rss.channel.item = items;

    return feed;
  } catch (error) {
    throw new Error(`Error on get feeds: ${error}`);
  }
}
