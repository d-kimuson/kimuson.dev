import * as v from "valibot";
import { contentsSchema } from "./core/schema";
import contentsJson from "../summary/contents.json";
import { Article, ArticleDetail, ExternalArticle } from "./core/types";
import { uniq } from "es-toolkit";

type SearchOptions = {
  text?: string | undefined;
  tags?: string[] | undefined;
};

type Module = {
  getAllArticles: () => ReadonlyArray<Article | ExternalArticle>;
  getAllInternalArticles: () => ReadonlyArray<Article>;
  searchArticles: (
    options: SearchOptions
  ) => ReadonlyArray<Article | ExternalArticle>;
  getArticle: (slug: string) => ArticleDetail | undefined;
  getAllTags: () => ReadonlyArray<string>;
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
  const allTags = uniq(merged.flatMap((article) => article.tags));

  return {
    getAllArticles: () => {
      return merged;
    },
    getAllInternalArticles: () => contents.internalArticles,
    getAllTags: () => allTags,
    searchArticles: (options) => {
      const textFilters = [
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
      ];
      const tagFilters = [
        ...(options.tags?.map(
          (tag) =>
            ({
              kind: "tag",
              value: tag,
            }) as const
        ) ?? []),
      ];

      if (textFilters.length === 0 && tagFilters.length === 0) return merged;

      return merged
        .flatMap((article) => {
          let priority = 0;

          const isMatchTextFilter =
            textFilters.length === 0 ||
            textFilters.filter((filter) => {
              if (article.title.includes(filter.value)) {
                priority += 2;
                return true;
              }

              if (
                "slug" in article &&
                articleMap.get(article.slug)?.content.includes(filter.value)
              ) {
                priority += 1;
                return true;
              }

              if (article.description?.includes(filter.value)) {
                priority += 1;
                return true;
              }

              return false;
            }).length >= 1;

          const isMatchTagFilter =
            tagFilters.length === 0 ||
            tagFilters.filter((filter) => {
              if (article.tags.includes(filter.value)) {
                priority += 1;
                return true;
              }

              return false;
            }).length >= 1;

          if (isMatchTagFilter && isMatchTextFilter)
            return [{ article, priority }] as const;
          return [];
        })
        .sort((a, b) => (b.priority > a.priority ? 1 : -1))
        .map(({ article }) => article);
    },
    getArticle: (slug) => {
      return articleMap.get(slug);
    },
  };
};

export const {
  getAllArticles,
  getAllInternalArticles,
  searchArticles,
  getArticle,
  getAllTags,
} = moduleClosure();

export type { Article, ArticleDetail, ExternalArticle };
