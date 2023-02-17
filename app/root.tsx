import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import PageLoading from "./components/PageLoading";
import MainStyles from "./styles/main.css";
import PageLoadingStyles from "~/styles/PageLoading.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Noticioso",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    { rel: "stylesheet", href: MainStyles },
    { rel: "stylesheet", href: PageLoadingStyles },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <PageLoading />
        <Outlet />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
