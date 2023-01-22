import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { json, Outlet, useLoaderData } from "react-router";
import { getFeeds } from "~/models/feeds.server";
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
  const feeds = useLoaderData() as LoaderData;

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (feeds) {
      localStorage.setItem("feeds", JSON.stringify(feeds));
    }
  }, [feeds]);

  return (
    <div className="Feeds">
      <div className="Feeds__list">
        <h2>Feeds</h2>
        {feeds.map((feed) => (
          <Link key={feed.url} to={`/feeds/${encodeURIComponent(feed.url)}`}>
            {feed.name}
          </Link>
        ))}
      </div>
      <div className="Feeds__content">
        <Outlet />
      </div>
    </div>
  );
}
