import type { LoaderFunction } from "@remix-run/node";
import { PrefetchPageLinks, useParams } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import {
  json,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import PagedNavigation from "~/components/PagedNavigation";
import PagedNavigationStyles from "~/styles/PagedNavigation.css";
import { getFeeds } from "~/server/getFeeds.server";
import { useGlobalFont } from "~/shared/useGlobalFont";
import FeedsCSS from "~/styles/Feeds.css";
import { getFeedNavigation } from "~/shared/getFeedNavigation";

type LoaderData = Awaited<ReturnType<typeof getFeeds>>;

export function links() {
  return [
    { rel: "stylesheet", href: FeedsCSS },
    { rel: "stylesheet", href: PagedNavigationStyles },
  ];
}

export const loader: LoaderFunction = async () => {
  const feeds = await getFeeds();

  return json<LoaderData>(feeds);
};

export default function Feeds() {
  useGlobalFont();
  const feeds = useLoaderData() as LoaderData;
  const location = useLocation();
  const navigate = useNavigate();
  let { feedUrl = "" } = useParams();
  const navigation = getFeedNavigation({
    feedUrl,
    feedsTxt: JSON.stringify(feeds),
  });

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (feeds) {
      localStorage.setItem("feeds", JSON.stringify(feeds));
    }
  }, [feeds]);

  const handleFeedSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    navigate(e.target?.value);
  };

  const onGoNextHandler = () => {
    navigate(navigation.nextUrl);
  };

  const onGoPrevHandler = () => navigate(navigation.prevUrl);

  const getTo = (url: string) => `/feeds/${encodeURIComponent(url)}`;

  const getActiveFeedTo = () => {
    const activeFeed = feeds.find((feed) => {
      const to = getTo(feed.url);
      const isActive = location.pathname === to;

      return isActive;
    });

    return activeFeed ? getTo(activeFeed.url) : "";
  };

  return (
    <div className="Feeds">
      {navigation.nextUrl && <PrefetchPageLinks page={navigation.nextUrl} />}
      {navigation.prevUrl && <PrefetchPageLinks page={navigation.prevUrl} />}

      <div className="Feeds__navigation">
        <select
          name="feeds"
          className="Feeds__select"
          onChange={handleFeedSelect}
          value={getActiveFeedTo()}
        >
          {feeds.map((feed, i) => {
            const to = getTo(feed.url);

            return (
              <option value={to} key={`${i}-${to}`}>
                {feed.name}
              </option>
            );
          })}
        </select>
      </div>

      <PagedNavigation onGoNext={onGoNextHandler} onGoPrev={onGoPrevHandler}>
        <div>
          <Outlet />
        </div>
      </PagedNavigation>
    </div>
  );
}
