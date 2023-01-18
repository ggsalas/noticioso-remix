import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node"; // or cloudflare/deno

export const meta: MetaFunction = () => ({
  title: "Noticioso",
  description: "RSS reader with full text and kindle like navigation",
  viewport:
    "width=device-width,initial-scale=1,maximum-scale=1.0,minimum-scale=1,user-scalable=no", // <meta name="viewport" content="width=device-width,initial-scale=1">
});

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {/* TODO: Add url as query param */}
      <Link to="/feed">Feed Perfil Politica</Link>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
