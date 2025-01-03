"use client";

import { useState, useMemo, FC } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ArticleDetail } from "articles";

export const generateStaticParams = async () => {};

export const ArticlePageContent: FC<{
  article: ArticleDetail;
}> = ({ article }) => {
  const tableOfContents = useMemo((): Array<{
    level: number;
    text: string;
  }> => {
    const headings = article?.content.match(/^##? .+$/gm) || [];
    return headings.map((heading) => ({
      level: heading.startsWith("##") ? 2 : 1,
      text: heading.replace(/^##? /, ""),
    }));
  }, [article]);

  const [isTocOpen, setIsTocOpen] = useState(false);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-400 mb-6">{article.date.toString()}</p>
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
                      href={`#${heading.text}`}
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
              h2({ children, ...props }) {
                return (
                  <h2 id={children} {...props} className="text-2xl font-bold">
                    {children}
                  </h2>
                );
              },
              h3({ children, ...props }) {
                return (
                  <h3 id={children} {...props} className="text-xl font-bold">
                    {children}
                  </h3>
                );
              },
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
};
