import Parser from "rss-parser";
import type { ExternalArticle } from "~/domain-object/article/external-article";

export const sites = [
  {
    name: "Zenn",
    feedUrl: "https://zenn.dev/kimuson/feed",
  },
  {
    name: "Qiita",
    feedUrl: "https://qiita.com/d-kimuson/feed",
  },
] as const;

export type FeedItem = {
  creator: string;
  title: string;
  link: string;
  pubDate: string;
  "dc:creator": string;
  content: string;
  contentSnippet: string;
  guid: "https://zenn.dev/kimuson/articles/b2a96d7c8729659379d3";
  isoDate: "2020-10-17T14:33:03.000Z";
};

const parser = new Parser<{ items: FeedItem[] }>();

const feedItemToExternalArticle = (
  item: FeedItem,
  siteName: ExternalArticle["siteName"]
): ExternalArticle => ({
  kind: "external",
  title: item.title,
  siteName,
  fullUrl: item.link,
  description: item.contentSnippet,
  date: new Date(item.isoDate),
  thumbnail: undefined,
});

export const fetchRssItems = async (
  url: string
): Promise<ExternalArticle[]> => {
  const feed = await parser.parseURL(url);
  if (!feed.items.length) return [];

  return feed.items.map((item) => feedItemToExternalArticle(item, "Zenn"));
};

export const fetchAllRssPosts = async (): Promise<ExternalArticle[]> => {
  return (
    await Promise.all(
      sites.map(async (site) => {
        return (await fetchRssItems(site.feedUrl)).map((post) => ({
          ...post,
          site: site,
        }));
      })
    )
  ).flat();
};
