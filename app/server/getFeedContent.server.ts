import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export async function getFeedContent(url: string) {
  try {
    const res = await axios.get(url, { responseType: "text" });

    const parser = new XMLParser();
    const feed = parser.parse(res.data);

    return feed;
  } catch (error) {
    throw new Error(`Error on get feeds: ${error}`);
  }
}
