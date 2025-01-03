"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

// 仮のデータ
const articles = [
  {
    id: 1,
    title: "Introduction to Next.js",
    date: "2023-07-01",
    tags: ["Next.js", "React", "JavaScript"],
    content: `
# Introduction to Next.js

Next.js is a powerful React framework that makes it easy to build server-side rendered and statically generated web applications.

## Key Features

1. **Server-Side Rendering (SSR)**: Next.js allows you to render React components on the server, which can improve performance and SEO.

2. **Static Site Generation (SSG)**: You can generate static HTML files at build time, which can be served directly from a CDN for blazing-fast performance.

3. **API Routes**: Next.js allows you to create API endpoints as part of your application, making it easy to build full-stack applications.

## Getting Started

To start a new Next.js project, you can use the following command:

\`\`\`bash
npx create-next-app@latest my-next-app
\`\`\`

This will set up a new Next.js project with all the necessary configurations.

## Conclusion

Next.js provides a great developer experience and powerful features out of the box. It's definitely worth considering for your next React project!
    `,
  },
];

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [tableOfContents, setTableOfContents] = useState<
    Array<{ level: number; text: string }>
  >([]);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const fetchedArticle = articles.find(
      (a) => a.id === parseInt(id as string)
    );
    setArticle(fetchedArticle);

    // Generate table of contents
    const headings = fetchedArticle?.content.match(/^##? .+$/gm) || [];
    setTableOfContents(
      headings.map((heading) => ({
        level: heading.startsWith("##") ? 2 : 1,
        text: heading.replace(/^##? /, ""),
      }))
    );
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-400 mb-6">{article.date}</p>
        <div className="mb-4">
          {article.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="mr-2">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mb-6 flex space-x-4">
          <Button variant="outline" size="sm">
            <FaGithub className="mr-2" />
            Propose Changes
          </Button>
          <Button variant="outline" size="sm">
            <FaGithub className="mr-2" />
            View History
          </Button>
        </div>
        <div className="hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 space-y-4">
          <Button variant="outline" size="icon">
            <FaTwitter />
          </Button>
          <Button variant="outline" size="icon">
            <FaFacebook />
          </Button>
          <Button variant="outline" size="icon">
            <FaLinkedin />
          </Button>
        </div>
        <div className="md:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="w-full flex justify-between items-center"
          >
            Table of Contents
            {isTocOpen ? (
              <ChevronUp className="ml-2" />
            ) : (
              <ChevronDown className="ml-2" />
            )}
          </Button>
          {isTocOpen && (
            <nav className="mt-4">
              <ul className="space-y-2">
                {tableOfContents.map((heading, index) => (
                  <li
                    key={index}
                    className={`${heading.level === 2 ? "ml-4" : ""}`}
                  >
                    <Link
                      href={`#${heading.text.toLowerCase().replace(/ /g, "-")}`}
                      className="text-blue-400 hover:underline"
                    >
                      {heading.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <nav>
            <ul className="space-y-2">
              {tableOfContents.map((heading, index) => (
                <li
                  key={index}
                  className={`${heading.level === 2 ? "ml-4" : ""}`}
                >
                  <Link
                    href={`#${heading.text.toLowerCase().replace(/ /g, "-")}`}
                    className="text-blue-400 hover:underline"
                  >
                    {heading.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
