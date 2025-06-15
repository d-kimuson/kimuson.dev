"use client";

import { FC, useMemo } from "react";
import { searchArticles } from "@kimuson.dev/articles";
import { ArticleGrid } from "@/components/ArticleGrid";

const useArticles = () => {
  const articles = useMemo(() => {
    return searchArticles({});
  }, []);

  return { articles };
};

export const HomePageContent: FC = () => {
  const { articles } = useArticles();

  return (
    <div>
      <ArticleGrid articles={[...articles]} />
    </div>
  );
};
