import type { getFeedContent } from "~/server/getFeedContent.server";

export type Article = any; // TODO update this

export type OldestArticle = 1 | 7;

export interface Feed {
  name: string;
  url: string;
  oldestArticle: OldestArticle;
  lang: "en" | "es";
}

export type FeedContent = Awaited<ReturnType<typeof getFeedContent>>;

export type Navigation = {
  nextUrl: string;
  prevUrl: string;
  currentFeed?: string;
};

export type Item = {
  title: string;
  link: string;
  pubDate: string;
  author?: string;
  description: string; // can have images
  "content:encoded"?: string; // can have images
  /* guid
   *
   * media:description
   * media:credit
   * content:encoded
   */
};

export type Channel = {
  title: string;
  description: string;
  language: string;
  link: string;
  lastBuildDate: string;
  item: Item[];
};

export type FeedData = {
  date: Date;
  rss: {
    channel: Channel;
  };
};
