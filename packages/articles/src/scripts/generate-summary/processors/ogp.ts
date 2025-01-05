import * as v from "valibot";
import ogs from "open-graph-scraper";
import { ExternalArticle } from "../../../core/types";
import { externalArticleSchema } from "../../../core/schema";

export async function fetchArticleFromOGP(
  group: string,
  url: string
): Promise<ExternalArticle> {
  const { result } = await ogs({
    url,
    customMetaTags: [
      {
        multiple: false,
        property: "article:published_time",
        fieldName: "publishedTime",
      },
      {
        multiple: true,
        property: "article:tag",
        fieldName: "tags",
      },
    ],
  });

  if (result.error) throw new Error(result.error);
  const publishedTime = result.customMetaTags?.["publishedTime"];
  if (Array.isArray(publishedTime)) throw new Error("Un expected format");
  const date = publishedTime
    ? new Date(Number.parseInt(publishedTime) * 1000)
    : undefined;

  return v.parse(externalArticleSchema, {
    title: result.ogTitle,
    description: result.ogDescription,
    url,
    date: date?.toISOString(),
    tags: [group].concat(result.customMetaTags?.["tags"] ?? []),
  });
}
