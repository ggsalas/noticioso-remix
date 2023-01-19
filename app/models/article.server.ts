import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

type ReadabilityArticle = ReturnType<Readability["parse"]>;

export async function getArticle(url: string): Promise<ReadabilityArticle> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error on get feeds: ${res.status}`);
  } else {
    const txt = await res.text();
    const doc = new JSDOM(txt);
    const article = new Readability(doc.window.document);

    return article.parse();
  }
}
