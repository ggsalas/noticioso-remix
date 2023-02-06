import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import { getFeeds } from "~/server/getFeeds.server";

export const loader: LoaderFunction = async () => {
  const feeds = await getFeeds();
  const url = `/feeds/${encodeURIComponent(feeds[0].url)}`;

  return redirect(url);
};

export default function Feeds() {
  return null;
}
