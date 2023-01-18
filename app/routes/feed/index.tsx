import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { getFeed } from "~/models/feed.server";
import Article from "~/components/Article";
import ArticleCSS from "~/styles/Article.css";
import type { MetaFunction } from "@remix-run/node"; // or cloudflare/deno

export const meta: MetaFunction = () => ({
  title: "Noticioso",
  description:
    "RSS reader with full text and kindle like navigation..............",
  viewport: "user-scalable=no",
});

export function links() {
  return [{ rel: "stylesheet", href: ArticleCSS }];
}

export const loader = async () => {
  return json(await getFeed());
};

export default function Feed() {
  const ref = useRef(null);
  const feed = useLoaderData<typeof loader>();
  const { item: newsfeed } = feed as any;
  const [displayItem, setDisplayItem] = useState(0);
  const [box, setBox] = useState<string>("no data");

  useEffect(() => {
    // if (ref.current) {
    //   ref.current.style.height = window.innerHeight;
    //   ref.current.style.border = "10px solid black";
    // }

    setBox(window.innerHeight.toString());

    // if (feed) {
    //   feed.style.height = window.innerHeight;
    //   feed.style.background = "black";
    //   // alert("hola");
    // }
  }, []);

  const onGoNextItem = () => {
    debugger;
    if (displayItem < newsfeed.length) {
      setDisplayItem(displayItem + 1);
    } else {
      alert("go next feed");
    }
  };

  return (
    <main className="Feed" ref={ref} id="feed">
      <p onClick={() => setBox("............... ")}>box: {box}</p>
      {/* <h1>{title}</h1> */}

      <Article content={newsfeed[displayItem]} onGoNextItem={onGoNextItem} />

      {/* <pre style={{ width: "90%", overflow: "scroll" }}>
        {JSON.stringify(feed, null, 4)}
      </pre> */}
    </main>
  );
}
