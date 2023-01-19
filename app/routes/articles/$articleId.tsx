import { useLoaderData } from "@remix-run/react";
import Article from "~/components/Article";
import type { LoaderArgs } from "@remix-run/node";
import ArticleCSS from "~/styles/Article.css";
import { getArticle } from "~/models/article.server";

export function links() {
  return [{ rel: "stylesheet", href: ArticleCSS }];
}

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.articleId) return;
  const article = await getArticle(params.articleId);

  return article;
};

export default function Feed() {
  const article = useLoaderData<typeof loader>();

  return (
    <main className="Feed">
      <Article content={article} />
    </main>
  );
}
