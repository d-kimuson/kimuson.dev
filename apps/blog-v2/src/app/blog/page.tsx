"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 仮のデータ
const articles = [
  {
    id: 1,
    title: "Introduction to Next.js",
    date: "2023-07-01",
    tags: ["Next.js", "React"],
  },
  {
    id: 2,
    title: "Advanced TypeScript Techniques",
    date: "2023-06-15",
    tags: ["TypeScript"],
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    date: "2023-05-30",
    tags: ["Node.js", "API"],
  },
];

const rssArticles = [
  {
    id: 1,
    title: "The Future of Web Development",
    source: "Medium",
    date: "2023-07-05",
  },
  {
    id: 2,
    title: "10 Must-Know JavaScript Tricks",
    source: "Dev.to",
    date: "2023-06-20",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTag === "" || article.tags.includes(selectedTag))
  );

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
          <Button onClick={() => setSelectedTag("")}>Clear Filter</Button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from(new Set(articles.flatMap((a) => a.tags))).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">{article.date}</p>
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
        <div className="space-y-4">
          {rssArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <a href="#" className="text-blue-400 hover:underline">
                    {article.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  {article.date} - {article.source}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
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
