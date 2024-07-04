import { Feed } from "~/types";

const HARDCODED_FEEDS: Feed[] = [
  {
    name: "Clarin - Política",
    url: "http://www.clarin.com/rss/politica/",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Clarin - Economía",
    url: "https://www.clarin.com/rss/economia/",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Clarin - Mundo",
    url: "http://www.clarin.com/rss/mundo/",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Clarin - Opinion",
    url: "https://www.clarin.com/rss/opinion/",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Clarin - Cultura",
    url: "https://www.clarin.com/rss/cultura/",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Clarin - Espectaculos",
    url: "http://www.clarin.com/rss/espectaculos/",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "La Nacion",
    url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Perfil - Política",
    url: "https://www.perfil.com/feed/politica",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Perfil - Economía",
    url: "https://www.perfil.com/feed/economia",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Perfil - Internacionales",
    url: "https://www.perfil.com/feed/internacional",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Perfil - Opinión",
    url: "https://www.perfil.com/feed/opinion",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Pagina12 - El Pais",
    url: "https://www.pagina12.com.ar/rss/secciones/el-pais/notas",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "Pagina12 - Economia",
    url: "https://www.pagina12.com.ar/rss/secciones/economia/notas",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "NYT - Spanish",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/es.xml",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "NYT - Americas",
    url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/americas/rss.xml",
    oldestArticle: 1,
    lang: "en",
  },
  {
    name: "ElObs UY - Nacional",
    url: "https://www.elobservador.com.uy/rss/pages/nacional.xml",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "ElObs UY - Argentina",
    url: "https://www.elobservador.com.uy/argentina/rss/pages/home.xml",
    oldestArticle: 1,
    lang: "es",
  },
  {
    name: "CSS-tricks",
    url: "https://css-tricks.com/feed/",
    oldestArticle: 7,
    lang: "en",
  },
  {
    name: "Javascript Scene",
    url: "https://medium.com/feed/javascript-scene",
    oldestArticle: 7,
    lang: "en",
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    oldestArticle: 7,
    lang: "en",
  },
  {
    name: "Asis",
    url: "https://jorgeasisdigital.com/feed",
    oldestArticle: 7,
    lang: "es",
  },
  {
    name: "Cavallo",
    url: "http://www.cavallo.com.ar/feed",
    oldestArticle: 7,
    lang: "es",
  },
];

export async function getFeeds(): Promise<Array<Feed>> {
  return HARDCODED_FEEDS;
}

export async function getFeedByUrl(url: string): Promise<Feed | undefined> {
  const feeds = await getFeeds();

  return feeds.find((f) => f.url.includes(url));
}
