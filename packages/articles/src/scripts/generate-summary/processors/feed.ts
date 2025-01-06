import Parser from "rss-parser";
import * as v from "valibot";
import { ExternalArticle } from "../../../core/types";
import { externalArticleSchema } from "../../../core/schema";

export async function fetchExternalArticles(
  feedUrl: string,
  group: string
): Promise<ExternalArticle[]> {
  const parser = new Parser();
  const feed = await parser.parseURL(feedUrl);

  return feed.items.map((item) =>
    v.parse(externalArticleSchema, {
      title: item.title,
      description: item.summary,
      url: item.link,
      date: item.pubDate,
      tags: group !== undefined ? [group] : [],
    })
  );
}
