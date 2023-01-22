import { Link } from "@remix-run/react";

/* export const meta: MetaFunction = () => ({
  title: "Noticioso",
  description: "RSS reader with full text and kindle like navigation",
}); */

export default function Index() {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        textAlign: "center",
      }}
    >
      <h1>Noticioso</h1>
      <h3>
        <i>Que tengas buena lectura</i>
      </h3>

      <Link to="/feeds">
        <button>Feeds</button>
      </Link>
    </div>
  );
}
