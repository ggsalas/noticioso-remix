import type { LoaderFunction } from "@remix-run/node";
import type { ChangeEvent } from "react";
import {
  json,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import PagedNavigationStyles from "~/styles/PagedNavigation.css";
import { getFeeds } from "~/server/getFeeds.server";
import { useGlobalFont } from "~/shared/useGlobalFont";
import FeedsCSS from "~/styles/Feeds.css";
import type { Feed } from "~/types";

type LoaderData = Awaited<{ feeds: Feed[] }>;

export function links() {
  return [
    { rel: "stylesheet", href: FeedsCSS },
    { rel: "stylesheet", href: PagedNavigationStyles },
  ];
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

export const loader: LoaderFunction = async () => {
  const feeds = await getFeeds();
  let headers = {
    "Cache-Control": "max-age=3600", // 1 hour
  };

  return json<LoaderData>({ feeds }, { headers });
};

export default function Feeds() {
  useGlobalFont();
  const { feeds } = useLoaderData() as LoaderData;
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeedSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    navigate(e.target?.value);
  };

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

      <Outlet />
    </div>
  );
}
