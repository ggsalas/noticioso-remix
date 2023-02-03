import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { json, Outlet, useLoaderData, useLocation } from "react-router";
import PageLoading from "~/components/PageLoading";
import { getFeeds } from "~/models/feeds.server";
import { useGlobalFont } from "~/shared/useGlobalFont";
import FeedsCSS from "~/styles/Feeds.css";
import PageTransition from "~/styles/PageLoading.css";

type LoaderData = Awaited<ReturnType<typeof getFeeds>>;

export function links() {
  return [
    { rel: "stylesheet", href: FeedsCSS },
    { rel: "stylesheet", href: PageTransition },
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

  // to use in the navigation of the feed and article pages
  useEffect(() => {
    if (feeds) {
      localStorage.setItem("feeds", JSON.stringify(feeds));
    }
  }, [feeds]);

  return (
    <div className="Feeds">
      <PageLoading />

      <div className="Feeds__list">
        <h2>Feeds</h2>
        {feeds.map((feed) => {
          const to = `/feeds/${encodeURIComponent(feed.url)}`;
          const isActive = location.pathname === to;

          return (
            <Link
              key={feed.url}
              to={to}
              className={
                isActive ? "Feeds_list_item-active" : "Feeds_list_item"
              }
            >
              {feed.name}
            </Link>
          );
        })}
      </div>
      <div className="Feeds__content">
        <Outlet />
      </div>
    </div>
  );
}
