import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, PrefetchPageLinks, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { getFeedContent } from "~/server/getFeedContent.server";
import { getNextFeedWithContentUrl } from "~/server/getNextFeedWithContent";

type LoaderData = Awaited<ReturnType<typeof getFeedContent>> & {
  nextFeedWithContentUrl?: string;
};

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.feedUrl) return;

  const feedContent: LoaderData = await getFeedContent(params.feedUrl);
  const content = feedContent.rss.channel.item;

  // Add nextFeedWithContentUrl to allow avoid useless navigation on many empty feeds
  if (!content.length || content.length === 0) {
    feedContent.nextFeedWithContentUrl = await getNextFeedWithContentUrl(
      params.feedUrl
    );
  }

  return json<LoaderData>(feedContent ?? null, {
    headers: {
      "Cache-Control": "max-age=3600", // 1 hour
    },
  });
};

export default function FeedUrl() {
  const feedContent = useLoaderData() as LoaderData;
  let { feedUrl } = useParams();

  const { item: content } = feedContent.rss.channel;

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (content) {
      localStorage.setItem(`feedContent-${feedUrl}`, JSON.stringify(content));
    }
  }, [content, feedUrl]);

  // Offers a link to the next feed with content to avoid multiple useless navigation
  if (feedContent.nextFeedWithContentUrl) {
    return (
      <div className="Feeds__item">
        <PrefetchPageLinks page={feedContent.nextFeedWithContentUrl} />

        <div className="Feeds__itemNoContent">
          <p>No content for today</p>

          <Link to={feedContent.nextFeedWithContentUrl}>
            <button>Ir a la siguiente sección con contenido</button>
          </Link>
        </div>
      </div>
    );
  }

  // If nextFeedWithContentUrl fails, show only the alert
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
