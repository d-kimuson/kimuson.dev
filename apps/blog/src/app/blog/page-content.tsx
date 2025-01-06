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
    <>
      <div className="mb-4 flex space-x-4">{searchInput}</div>

      <details className="mb-6">
        <summary>Filter by tags</summary>
        <div className="mb-6 flex flex-wrap gap-2">{tagFilter}</div>
      </details>
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <Card key={"slug" in article ? article.slug : article.url}>
            <CardHeader>
              <CardTitle>
                {"slug" in article ? (
                  <Link href={`/blog/${article.slug}/`}>{article.title}</Link>
                ) : (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    {article.title} <ExternalLinkIcon />
                  </a>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                published: {article.date.toLocaleDateString()}{" "}
                {article.date.toLocaleTimeString()}
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
    </>
  );
};
