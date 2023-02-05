import { Readability } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

export async function getArticle(url: string): Promise<ReadabilityArticle> {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      },
      responseType: "text",
    });

    const doc = new JSDOM(res.data);
    const article = new Readability(doc.window.document);

    return article.parse();
  } catch (error) {
    throw new Error(`Error on get article: ${error}`);
  }
}
