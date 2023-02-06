import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { getFeedContent } from "~/server/getFeedContent.server";

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
    // description,
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
    <>
      {content
        ? content.map((item: any) => {
            const {
              title,
              guid,
              link,
              description,
              author,
              // pubDate, description, author,
            } = item;

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
                {/* <div className="Feeds__itemDescription">
                    <p>paragraph</p>
                    nada
                  </div> */}
              </Link>
            );
          })
        : "no items"}
    </>
  );
}
