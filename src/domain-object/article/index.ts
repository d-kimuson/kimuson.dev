import type { ExternalArticle } from "~/article/external-article";
import type { InternalArticle } from "~/article/internal-article";

export type Article = InternalArticle | ExternalArticle;

export const isContainKeyword = (article: Article, keyword: string): boolean =>
  article.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
  (article.description
    ? article.description.toLowerCase().indexOf(keyword.toLowerCase()) > -1
    : false);
