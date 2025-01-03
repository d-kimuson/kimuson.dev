"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchArticles, getAllTags } from "articles";

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
        <h1 className="text-3xl font-bold mb-6">Latest Articles</h1>
        <div className="mb-4 flex space-x-4">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={() => setSelectedTags([])}>Clear Filter</Button>
        </div>
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
        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <Card key={"slug" in article ? article.slug : article.url}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={
                      "slug" in article ? `/blog/${article.slug}` : article.url
                    }
                    className="text-blue-400 hover:underline"
                  >
                    {article.title}
                  </Link>
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
        <h2 className="text-2xl font-bold mt-12 mb-6">From Other Sources</h2>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src="/avatar.jpg" alt="Profile Picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-2">John Doe</h2>
            <p className="text-center text-gray-400 mb-4">
              Full-stack developer passionate about creating efficient and
              scalable web applications.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                <Link href="/about">More About Me</Link>
              </Button>
              <Button variant="outline" size="sm">
                <Link href="/projects">My Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
