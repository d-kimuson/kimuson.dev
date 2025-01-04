import * as v from "valibot";
import { JSDOM } from "jsdom";
import { ExternalArticle } from "../../../core/types";
import { externalArticleSchema } from "../../../core/schema";

export async function fetchArticleFromOGP(
  group: string,
  url: string
): Promise<ExternalArticle> {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const getMetaContents = (property: string) => {
    return Array.from(
      document.querySelectorAll(
        `meta[property="${property}"], meta[name="${property}"]`
      )
    ).map((meta) => meta.getAttribute("content") ?? undefined);
  };

  const title = getMetaContents("og:title").at(0);
  const description = getMetaContents("og:description").at(0);
  const metaPublishedTime = getMetaContents("article:published_time").at(0);
  if (metaPublishedTime === undefined) throw new Error("Un expected format");
  const date = new Date(
    Number.parseInt(metaPublishedTime) * 1000
  ).toISOString();
  const tags = getMetaContents("article:tag") ?? [];

  return v.parse(externalArticleSchema, {
    title,
    description,
    url,
    date,
    tags: [group, ...tags],
  });
}
