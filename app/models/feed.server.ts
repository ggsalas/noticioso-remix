type Post = {
  slug: string;
  title: string;
};

const FULL_FEED_URL =
  "http://patient-lake-3486.fly.dev/makefulltextfeed.php?max=10&links=preserve&exc=&format=json&submit=Create+Feed&url=";

export async function getFeed(): Promise<Array<Post>> {
  const url = `${FULL_FEED_URL}https://www.perfil.com/feed/economia`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error on get feeds: ${res.status}`);
  } else {
    const feeds = await res.json();
    return feeds.rss.channel;
  }
}