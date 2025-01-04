"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchArticles, getAllTags } from "articles";
import { AboutMeCard } from "@/components/AboutMeCard";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredArticles = useMemo(() => {
    return searchArticles({
      text: searchTerm === "" ? undefined : searchTerm,
      tags: selectedTags,
    });
  }, [searchTerm, selectedTags]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <div className="mb-4 flex space-x-4">
          <Input
            type="text"
            placeholder="記事を検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>

        <details className="mb-6">
          <summary>タグで絞り込む</summary>
          <div className="mb-6 flex flex-wrap gap-2">
            {getAllTags().map((tag) => (
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
            ))}
          </div>
        </details>
        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <Card key={"slug" in article ? article.slug : article.url}>
              <CardHeader>
                <CardTitle>
                  {"slug" in article ? (
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  ) : (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  {article.date.toString()}
                </p>
                <div className="mt-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="mr-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="sticky top-[80px] self-start">
        <AboutMeCard />
      </div>
    </div>
  );
}
