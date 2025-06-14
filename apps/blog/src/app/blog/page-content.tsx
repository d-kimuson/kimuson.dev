"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchArticles, getAllTags } from "@kimuson.dev/articles";
import { ExternalLinkIcon } from "lucide-react";

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
      <div className="space-y-6">
        {filteredArticles.map((article) => {
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
                <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm cursor-pointer">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors duration-200">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium">
                      published: {article.date.toLocaleDateString()}{" "}
                      {article.date.toLocaleTimeString()}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="hover:bg-accent/50 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
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
                <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm cursor-pointer">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors duration-200 flex items-center gap-1">
                      {article.title} <ExternalLinkIcon className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium">
                      published: {article.date.toLocaleDateString()}{" "}
                      {article.date.toLocaleTimeString()}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="hover:bg-accent/50 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
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
