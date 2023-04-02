// eslint-disable-next-line @typescript-eslint/no-redeclare

export type Article = any; // TODO update this

export type OldestArticle = 1 | 7;

export interface Feed {
  name: string;
  url: string;
  oldestArticle: OldestArticle;
  lang: "en" | "es";
}
