"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { searchArticles, getAllTags } from "@kimuson.dev/articles";
import { ExternalLinkIcon } from "lucide-react";

const getCategoryEmoji = (tags: string[], category?: string) => {
  if (tags.includes("zenn")) return "🔷";
  if (
    category?.includes("フロントエンド") ||
    tags.some((tag) =>
      ["React", "Vue.js", "Next", "Gatsby", "TypeScript"].includes(tag)
    )
  )
    return "💻";
  if (
    category?.includes("バックエンド") ||
    tags.some((tag) => ["Django", "Python", "Node.js"].includes(tag))
  )
    return "⚙️";
  if (
    category?.includes("インフラ") ||
    tags.some((tag) => ["Docker", "AWS", "Ubuntu"].includes(tag))
  )
    return "🛠️";
  if (tags.some((tag) => ["shell", "bash"].includes(tag))) return "🔧";
  if (tags.includes("VSCode")) return "📝";
  if (tags.includes("GAS")) return "📊";
  if (category?.includes("雑記")) return "📖";
  return "📄";
};

const getExternalSiteIcon = (article: { tags: string[] }) => {
  if (article.tags.includes("zenn")) {
    return (
      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200">
        <Image
          src="/zenn-logo.svg"
          alt="Zenn"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </div>
    );
  }
  return (
    <Avatar className="w-8 h-8">
      <AvatarFallback className="bg-orange-500 text-white text-sm">
        🔗
      </AvatarFallback>
    </Avatar>
  );
};

const useSearchArticles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredArticles = useMemo(() => {
    return searchArticles({
      text: searchTerm === "" ? undefined : searchTerm,
      tags: selectedTags,
    });
  }, [searchTerm, selectedTags]);

  return {
    filteredArticles,
    selectedTags,
    searchInput: (
      <Input
        type="text"
        placeholder="Search articles"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
    ),
    tagFilter: getAllTags().map((tag) => (
      <Badge
        key={tag}
        variant={selectedTags.includes(tag) ? "default" : "secondary"}
        className="cursor-pointer"
        onClick={() => {
          if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
          } else {
            setSelectedTags([...selectedTags, tag]);
          }
        }}
      >
        {tag}
      </Badge>
    )),
  };
};

export const HomePageContent: FC = () => {
  const { filteredArticles, searchInput, tagFilter } = useSearchArticles();

  return (
    <div>
      <div className="mb-4 flex space-x-4">{searchInput}</div>

      <details className="mb-6">
        <summary>Filter by tags</summary>
        <div className="mb-6 flex flex-wrap gap-2">{tagFilter}</div>
      </details>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => {
          const categoryEmoji = getCategoryEmoji(
            article.tags,
            "slug" in article ? article.slug?.split("/")[1] : undefined
          );

          if ("slug" in article) {
            return (
              <Link
                key={article.slug}
                href={
                  article.slug.startsWith("/")
                    ? `/blog${article.slug as `/${string}`}/`
                    : `/blog/${article.slug}/`
                }
                className="block"
              >
                <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-lg">
                          {categoryEmoji}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-primary transition-colors duration-200 text-base leading-tight">
                          {article.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium mb-3">
                      {article.date.toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="hover:bg-accent/50 transition-colors text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          } else {
            return (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {getExternalSiteIcon(article)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-primary transition-colors duration-200 flex items-start gap-1 text-base leading-tight">
                          <span className="flex-1">{article.title}</span>
                          <ExternalLinkIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium mb-3">
                      {article.date.toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="hover:bg-accent/50 transition-colors text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          }
        })}
      </div>
    </div>
  );
};
