import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "~/config/site";
import { buildInternalArticle } from "~/domain-object/article/internal-article";

const entries = await getCollection("internal-article");

const internalArticles = await Promise.all(
  entries.map((entry) => buildInternalArticle(entry))
).then((entries) =>
  entries.slice().sort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1))
);

export const get = async () =>
  rss({
    title: siteConfig.siteName,
    description: "kimuson.dev's RSS feed",
    site: siteConfig.baseUrl,
    items: internalArticles.map((article) => ({
      title: article.title,
      pubDate: article.date,
      description: article.description,
      customData: undefined,
      link: article.fullUrl,
    })),
  });
