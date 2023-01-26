import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { getFeedContent } from "~/models/feed.server";

type LoaderData = Awaited<ReturnType<typeof getFeedContent>>;

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.feedUrl) return;

  const feedContent = await getFeedContent(params.feedUrl);

  return feedContent ? json<LoaderData>(feedContent) : null;
};

// TODO: fetch feed and render as columns
// save scroll (horizontal) position to remember on come back later
export default function () {
  const feedContent = useLoaderData() as LoaderData;
  let { feedUrl } = useParams();

  const {
    // title,
    // link,
    // desceiption,
    // languae,
    // image,
    item: content,
  } = feedContent.rss.channel;

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (content) {
      localStorage.setItem(`feedContent-${feedUrl}`, JSON.stringify(content));
    }
  }, [content, feedUrl]);

  return (
    <div>
      {content
        ? content.map((item: any) => {
            const {
              title,
              guid,
              link,
              // pubDate, description, author,
            } = item;

            return (
              <Link
                to={`/feeds/${encodeURIComponent(
                  feedUrl as string
                )}/${encodeURIComponent(link)}`}
                key={guid}
              >
                <h3>{title}</h3>
                {/* TODO get only txt and image <div dangerouslySetInnerHTML={{ __html: description }} /> */}
              </Link>
            );
          })
        : "no items"}
    </div>
  );
}
