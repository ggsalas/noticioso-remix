import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  // ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import Main from "./styles/Main.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Noticioso",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: Main }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        {/* <ScrollRestoration /> */}
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
