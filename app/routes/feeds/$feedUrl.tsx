import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { getFeedContent } from "~/server/getFeedContent.server";

type LoaderData = Awaited<ReturnType<typeof getFeedContent>>;

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.feedUrl) return;

  const feedContent = await getFeedContent(params.feedUrl);

  let headers = {
    "Cache-Control": "max-age=3600", // 1 hour
  };

  return json<LoaderData>(feedContent ?? null, { headers });
};

// TODO: fetch feed and render as columns
// save scroll (horizontal) position to remember on come back later
export default function () {
  const feedContent = useLoaderData() as LoaderData;
  let { feedUrl } = useParams();

  const { item: content } = feedContent.rss.channel;

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (content) {
      localStorage.setItem(`feedContent-${feedUrl}`, JSON.stringify(content));
    }
  }, [content, feedUrl]);

  // TODO: use a cookie? to allow redirect from the loader
  if (!content.length || content.length === 0) {
    return (
      <div className="Feeds__item">
        <p className="Feeds__itemNoContent">No content for today</p>
      </div>
    );
  }

  return (
    <>
      {content.map((item: any) => {
        const { title, guid, link, description, author } = item;

        return (
          <Link
            to={`/feeds/${encodeURIComponent(
              feedUrl as string
            )}/${encodeURIComponent(link)}`}
            key={guid}
            className="Feeds__item"
          >
            <h3>{title}</h3>

            {author && <p className="Feeds__itemAuthor">{author}</p>}

            {description && (
              <p
                className="Feeds__itemDescription"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}
