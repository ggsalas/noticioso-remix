// eslint-disable-next-line @typescript-eslint/no-redeclare

export type Article = any; // TODO update this
export interface Feed {
  name: string;
  url: string;
  oldestArticle: 1 | 7;
  lang: "en" | "es";
}
