interface Feed {
  name: string;
  url: string;
  oldestArticle: 1;
}

const HARDCODED_FEEDS: Feed[] = [
  {
    name: "Perfil - Política",
    url: "https://www.perfil.com/feed/politica",
    oldestArticle: 1,
  },
  {
    name: "Perfil - Economía",
    url: "https://www.perfil.com/feed/economia",
    oldestArticle: 1,
  },
  {
    name: "Perfil - Internacionales",
    url: "https://www.perfil.com/feed/internacional",
    oldestArticle: 1,
  },
  {
    name: "Perfil - Opinión",
    url: "https://www.perfil.com/feed/opinion",
    oldestArticle: 1,
  },
  {
    name: "Perfil - Ciencia",
    url: "https://www.perfil.com/feed/ciencia",
    oldestArticle: 1,
  },

  {
    name: "Clarin - Política",
    url: "http://www.clarin.com/rss/politica/",
    oldestArticle: 1,
  },
  {
    name: "Clarin - Economía",
    url: "https://www.clarin.com/rss/economia/",
    oldestArticle: 1,
  },
  {
    name: "Clarin - Mundo",
    url: "http://www.clarin.com/rss/mundo/",
    oldestArticle: 1,
  },
  {
    name: "Clarin - Opinion",
    url: "https://www.clarin.com/rss/opinion/",
    oldestArticle: 1,
  },
  {
    name: "Clarin - Cultura",
    url: "https://www.clarin.com/rss/cultura/",
    oldestArticle: 1,
  },
  {
    name: "Clarin - Espectaculos",
    url: "http://www.clarin.com/rss/espectaculos/",
    oldestArticle: 1,
  },

  {
    name: "Pagina12 - El Pais",
    url: "https://www.pagina12.com.ar/rss/secciones/el-pais/notas",
    oldestArticle: 1,
  },
  {
    name: "Pagina12 - Economia",
    url: "https://www.pagina12.com.ar/rss/secciones/economia/notas",
    oldestArticle: 1,
  },
  {
    name: "Pagina12 - El Mundo",
    url: "https://www.pagina12.com.ar/rss/secciones/el-mundo/notas",
    oldestArticle: 1,
  },

  {
    name: "LC MDP - La Ciudad",
    url: "https://www.lacapitalmdp.com/categorias/la-ciudad/feed",
    oldestArticle: 1,
  },
  {
    name: "LC MDP - Interés General",
    url: "https://www.lacapitalmdp.com/categorias/interes-general/feed",
    oldestArticle: 1,
  },
  {
    name: "LC MDP - Gastronomía",
    url: "https://www.lacapitalmdp.com/categorias/gastronomia/feed",
    oldestArticle: 1,
  },
  {
    name: "LC MDP - Arte y Espectáculos",
    url: "https://www.lacapitalmdp.com/categorias/espectaculos/feed",
    oldestArticle: 1,
  },

  {
    name: "NYT - Spanish",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/es.xml",
    oldestArticle: 1,
  },
  {
    name: "NYT - Americas",
    url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/americas/rss.xml",
    oldestArticle: 1,
  },
  {
    name: "NYT - Business",
    url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/business/rss.xml",
    oldestArticle: 1,
  },
  {
    name: "NYT - Politics",
    url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/politics/rss.xml",
    oldestArticle: 1,
  },
  {
    name: "NYT - Opinion",
    url: "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/opinion/rss.xml",
    oldestArticle: 1,
  },

  {
    name: "El Pais ES - España",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/espana/portada",
    oldestArticle: 1,
  },
  {
    name: "El Pais ES - Portada America",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada",
    oldestArticle: 1,
  },
  {
    name: "El Pais ES - Internacional",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada",
    oldestArticle: 1,
  },
  {
    name: "El Pais ES - Opinión",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada",
    oldestArticle: 1,
  },

  {
    name: "ElObs UY - Nacional",
    url: "https://www.elobservador.com.uy/rss/elobservador/nacional.xml",
    oldestArticle: 1,
  },
  {
    name: "ElObs UY - Economia",
    url: "https://www.elobservador.com.uy/rss/elobservador/economia-y-empresas.xml",
    oldestArticle: 1,
  },
  {
    name: "ElObs UY - Mundo",
    url: "https://www.elobservador.com.uy/rss/elobservador/mundo.xml",
    oldestArticle: 1,
  },
  {
    name: "ElObs UY - Argentina",
    url: "https://www.elobservador.com.uy/rss/elobservador/argentina.xml",
    oldestArticle: 1,
  },
  {
    name: "ElObs UY - Opinión",
    url: "https://www.elobservador.com.uy/rss/elobservador/opinion.xml",
    oldestArticle: 1,
  },
];

export async function getFeeds(): Promise<Array<Feed>> {
  return HARDCODED_FEEDS;
}
