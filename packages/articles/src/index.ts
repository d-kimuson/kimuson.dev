import * as v from "valibot";
import { contentsSchema } from "./core/schema";
import contentsJson from "../summary/contents.json";
import { Article, ArticleDetail, ExternalArticle } from "./core/types";

type SearchOptions = {
  text?: string | undefined;
  tags?: string[] | undefined;
};

type Module = {
  getAllArticles: () => ReadonlyArray<Article | ExternalArticle>;
  searchArticles: (
    options: SearchOptions
  ) => Promise<ReadonlyArray<Article | ExternalArticle>>;
  getArticle: (slug: string) => ArticleDetail | undefined;
};

const moduleClosure = (): Module => {
  const contents = v.parse(contentsSchema, contentsJson);
  const articleMap = new Map<string, ArticleDetail>(
    contents.internalArticles.map((article) => [article.slug, article])
  );

  const merged = [
    ...contents.internalArticles.map(
      ({ content, ...others }): Article => others
    ),
    ...contents.externalArticles.flatMap(({ articles }) => articles),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    getAllArticles: () => {
      return merged;
    },
    searchArticles: async (options) => {
      const filters = [
        ...(options.text
          ?.split(" ")
          .filter((token) => token !== "")
          ?.map(
            (value) =>
              ({
                kind: "text",
                value,
              }) as const
          ) ?? []),
        ...(options.tags?.map(
          (tag) =>
            ({
              kind: "tag",
              value: tag,
            }) as const
        ) ?? []),
      ];

      return merged
        .flatMap((article) => {
          let isMatch = false;
          let priority = 0;

          for (const filter of filters) {
            switch (filter.kind) {
              case "text": {
                if (article.title.includes(filter.value)) {
                  isMatch = true;
                  priority += 2;
                  break;
                }

                if (
                  "slug" in article &&
                  articleMap.get(article.slug)?.content.includes(filter.value)
                ) {
                  isMatch = true;
                  priority += 1;
                  break;
                }

                if (article.description?.includes(filter.value)) {
                  isMatch = true;
                  priority += 1;
                }

                break;
              }
              case "tag":
                if (article.tags.includes(filter.value)) {
                  isMatch = true;
                  priority += 1;
                }
                break;
            }
          }

          if (!isMatch) return [];

          return [
            {
              article,
              priority,
            } as const,
          ];
        })
        .sort((a, b) => b.priority - a.priority)
        .map(({ article }) => article);
    },
    getArticle: (slug) => {
      return articleMap.get(slug);
    },
  };
};

export const { getAllArticles, searchArticles, getArticle } = moduleClosure();
