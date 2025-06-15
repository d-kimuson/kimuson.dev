import { getAllTags, searchArticles } from "@kimuson.dev/articles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タグ一覧",
  description: "ブログ記事のタグ一覧ページです。",
};

async function getTagsWithCount() {
  const allTags = getAllTags();
  const allArticles = await searchArticles({});

  return allTags
    .map((tag) => {
      const articlesWithTag = allArticles.filter((article) =>
        article.tags.includes(tag)
      );
      return {
        name: tag,
        count: articlesWithTag.length,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export default async function TagsPage() {
  const tagsWithCount = await getTagsWithCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
          タグ一覧
        </h1>
        <p className="text-muted-foreground">
          {tagsWithCount.length} 個のタグで{" "}
          {tagsWithCount.reduce((sum, tag) => sum + tag.count, 0)}{" "}
          記事を分類しています
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tagsWithCount.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}` as `/tags/${string}`}
            className="group"
          >
            <Card className="h-full transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-200"
                  >
                    {tag.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tag.count} 記事
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:from-purple-500 group-hover:to-pink-500"
                    style={{
                      width: `${Math.min((tag.count / Math.max(...tagsWithCount.map((t) => t.count))) * 100, 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {tagsWithCount.length === 0 && (
        <div className="text-center text-muted-foreground">
          <p>タグが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
