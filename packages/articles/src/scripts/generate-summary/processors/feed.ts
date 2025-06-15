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

  return feed.items.map((item) => {
    // pubDateが存在しない場合の処理
    let date = item.pubDate;
    if (!date) {
      console.warn(
        `No pubDate found for feed item: ${item.link}. Using current date.`
      );
      date = new Date().toISOString();
    }

    return v.parse(externalArticleSchema, {
      title: item.title,
      description: item.summary,
      url: item.link,
      date: date,
      tags: group !== undefined ? [group] : [],
    });
  });
}
