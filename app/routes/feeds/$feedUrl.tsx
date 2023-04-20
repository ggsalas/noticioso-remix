import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  PrefetchPageLinks,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import PagedNavigation from "~/components/PagedNavigation";
import NavigationBar from "~/components/PagedNavigation/NavigationBar";
import { getFeedContent } from "~/server/getFeedContent.server";
import { getFeeds } from "~/server/getFeeds.server";
import { getNextFeedWithContentUrl } from "~/server/getNextFeedWithContent";
import { getFeedNavigation } from "~/shared/getFeedNavigation";
import type { Feed, FeedContent, Navigation, OldestArticle } from "~/types";

type LoaderData = {
  updated: Date;
  feedOldestArticle?: OldestArticle;
  feedContent: FeedContent;
  nextFeedWithContentUrl?: string;
  navigation: Navigation;
};

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.feedUrl) return;

  // Get navigation urls
  const feeds = await getFeeds();
  const navigation = getFeedNavigation({
    feedUrl: params.feedUrl,
    feeds,
  });

  const feedContent: FeedContent = await getFeedContent(params.feedUrl);
  const content = feedContent.rss.channel.item;
  let nextFeedWithContentUrl = undefined;

  // Add nextFeedWithContentUrl to allow avoid useless navigation on multiple empty feeds
  if (!content.length || content.length === 0) {
    nextFeedWithContentUrl = await getNextFeedWithContentUrl(params.feedUrl);
  }

  const updated = feedContent.date;

  function getOldestArticle(feeds: Feed[], feedUrl: string) {
    const feed: Feed | undefined = feeds.find(
      (feed: Feed) => feed.url === feedUrl
    );

    return feed?.oldestArticle ?? undefined;
  }

  return json<LoaderData>(
    {
      navigation,
      nextFeedWithContentUrl,
      feedContent,
      updated,
      feedOldestArticle: getOldestArticle(feeds, params.feedUrl),
    },
    {
      headers: {
        "Cache-Control": "private, max-age=3600", // 1 hour
      },
    }
  );
};

export default function FeedUrl() {
  const { feedUrl } = useParams();
  const {
    feedContent,
    nextFeedWithContentUrl,
    navigation,
    updated,
    feedOldestArticle,
  } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const { item: content } = feedContent.rss.channel;

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (content) {
      localStorage.setItem(`feedContent-${feedUrl}`, JSON.stringify(content));
    }
  }, [content, feedUrl]);

  const onGoNextHandler = () => navigate(navigation.nextUrl);
  const onGoPrevHandler = () => navigate(navigation.prevUrl);

  const noContent = nextFeedWithContentUrl ? (
    // Offers a link to the next feed with content to avoid multiple useless navigation
    <div className="Feeds__item">
      <PrefetchPageLinks page={nextFeedWithContentUrl} />

      <div className="Feeds__itemNoContent">
        <p>
          No hay contenido publicado en
          {feedOldestArticle === 1
            ? " las últimas 24 horas"
            : " la ultima semena"}
          .
        </p>

        <Link to={nextFeedWithContentUrl}>
          <button>Ir a la siguiente sección actualizada</button>
        </Link>
      </div>
    </div>
  ) : (
    // Only display empty view
    <div className="Feeds__item">
      <p className="Feeds__itemNoContent">No content for today</p>
    </div>
  );

  return (
    <>
      {navigation.nextUrl && <PrefetchPageLinks page={navigation.nextUrl} />}
      {navigation.prevUrl && <PrefetchPageLinks page={navigation.prevUrl} />}

      <PagedNavigation
        onGoNext={onGoNextHandler}
        onGoPrev={onGoPrevHandler}
        footer={(props) => <NavigationBar mode="pages" {...props} />}
        header={() => (
          <div className="Feeds__lastUpdated">
            <div className="Feeds__lastUpdatedContent">
              <span>
                {feedOldestArticle === 1 ? "Últimas 24hs" : "Últimos 7 días"}
              </span>

              <span>
                Actualizado al{" "}
                {new Date(updated).toLocaleString("es-AR", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </div>
          </div>
        )}
      >
        <div>
          {!content.length || content.length === 0
            ? noContent
            : content.map((item: any) => {
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
        </div>
      </PagedNavigation>
    </>
  );
}
