"use client";

import { FC } from "react";
import { ArticleCard } from "./ArticleCard";
import type { Article, ExternalArticle } from "@kimuson.dev/articles";

interface ArticleGridProps {
  articles: (Article | ExternalArticle)[];
  emptyMessage?: string;
}

export const ArticleGrid: FC<ArticleGridProps> = ({
  articles,
  emptyMessage = "記事が見つかりませんでした。",
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={"slug" in article ? article.slug : article.url}
          article={article}
        />
      ))}
    </div>
  );
};
