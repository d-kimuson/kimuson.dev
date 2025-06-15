"use client";

import { FC } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash } from "lucide-react";
import { ArticleGrid } from "@/components/ArticleGrid";
import type { Article, ExternalArticle } from "@kimuson.dev/articles";

interface TagPageContentProps {
  tag: string;
  articles: (Article | ExternalArticle)[];
}

export const TagPageContent: FC<TagPageContentProps> = ({ tag, articles }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/tags">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              タグ一覧に戻る
            </Button>
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hash className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {tag}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {articles.length} 件の記事が見つかりました
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
          >
            # {tag}
          </Badge>
        </div>
      </div>

      <ArticleGrid
        articles={articles}
        emptyMessage="このタグの記事が見つかりませんでした。"
      />
    </div>
  );
};
