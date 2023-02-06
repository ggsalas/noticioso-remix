import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { ChangeEvent, useEffect } from "react";
import {
  json,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { getFeeds } from "~/server/getFeeds.server";
import { useGlobalFont } from "~/shared/useGlobalFont";
import FeedsCSS from "~/styles/Feeds.css";

type LoaderData = Awaited<ReturnType<typeof getFeeds>>;

export function links() {
  return [{ rel: "stylesheet", href: FeedsCSS }];
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

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (feeds) {
      localStorage.setItem("feeds", JSON.stringify(feeds));
    }
  }, [feeds]);

  const handleFeedSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    navigate(e.target?.value);
  };

  return (
    <div className="Feeds">
      <div className="Feeds__navigation">
        <select
          name="feeds"
          className="Feeds__select"
          onChange={handleFeedSelect}
        >
          {feeds.map((feed) => {
            const to = `/feeds/${encodeURIComponent(feed.url)}`;
            const isActive = location.pathname === to;

            return (
              <option value={to} selected={isActive} key={to}>
                {feed.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="Feeds__content">
        <Outlet />
      </div>
    </div>
  );
}
