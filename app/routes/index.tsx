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
      <Link to="/feed">Feed Perfil Politica</Link>
      <Link to="/article">Article</Link>
    </div>
  );
}
