"use client";

import { useState, useMemo, FC } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaTwitter, FaGithub } from "react-icons/fa";
import {
  ChevronDown,
  ChevronUp,
  CopyIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";
import { ArticleDetail } from "@kimuson.dev/articles";
import { siteConfig } from "@/config/site";
import { OGPData } from "@/app/blog/[...slug]/opg-image";
import Head from "next/head";

const OGPCard: FC<{ ogp: OGPData }> = ({ ogp }) => {
  return (
    <a
      href={ogp.url}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline border border-gray-700 rounded-lg overflow-hidden hover:border-gray-500 transition-colors flex h-[150px]"
    >
      <div className="flex-grow flex flex-col justify-center gap-2 px-4">
        <h3 className="text-lg font-semibold line-clamp-2">{ogp.title}</h3>
        {ogp.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {ogp.description}
          </p>
        )}
        {ogp.siteName && (
          <p className="text-xs text-gray-500">{ogp.siteName}</p>
        )}
      </div>
      {ogp.image !== undefined && (
        <img
          src={ogp.image.url}
          className="object-cover h-[150px] w-auto"
          style={{
            aspectRatio: ogp.image.aspectRatio,
          }}
        />
      )}
    </a>
  );
};

export const generateStaticParams = async () => {};

export const ArticlePageContent: FC<{
  article: ArticleDetail;
  ogpMap: Record<string, OGPData | undefined>;
}> = ({ article, ogpMap }) => {
  const articleUrl = useMemo(
    () => new URL("/blog" + article.slug, siteConfig.baseUrl).href + "/",
    [article]
  );

  const tableOfContents = useMemo((): Array<{
    level: number;
    text: string;
    id: string;
  }> => {
    const headings = article?.content.match(/^##? .+$/gm) || [];
    return headings.map((heading) => {
      const text = heading.replace(/^##? /, "");
      return {
        level: heading.startsWith("##") ? 2 : 1,
        text,
        id: text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      };
    });
  }, [article]);

  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isTocExpanded, setIsTocExpanded] = useState(true);

  const getCategoryEmoji = (tags: string[]) => {
    if (tags.includes("zenn")) return "🔷";
    if (
      tags.some((tag) =>
        ["React", "Vue.js", "Next", "Gatsby", "TypeScript"].includes(tag)
      )
    )
      return "💻";
    if (tags.some((tag) => ["Django", "Python", "Node.js"].includes(tag)))
      return "⚙️";
    if (tags.some((tag) => ["Docker", "AWS", "Ubuntu"].includes(tag)))
      return "🛠️";
    if (tags.some((tag) => ["shell", "bash"].includes(tag))) return "🔧";
    if (tags.includes("VSCode")) return "📝";
    if (tags.includes("GAS")) return "📊";
    return "📄";
  };

  return (
    <>
      <Head>
        <title>{article.title} | kimuson.dev</title>
      </Head>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm mb-8">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-xl">
                      {getCategoryEmoji(article.tags)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl lg:text-3xl font-bold leading-tight mb-4">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{article.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TagIcon className="w-4 h-4" />
                        <span>{article.tags.length} tags</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 5).map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                        >
                          <Badge
                            variant="default"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                      {article.tags.length > 5 && (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-500/30 transition-all duration-200"
                        >
                          +{article.tags.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(`${article.title} | kimuson.dev`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter className="mr-2 h-4 w-4" />
                      シェア
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://github.com/d-kimuson/kimuson.dev/tree/main/packages/articles/content${article.slug.replace(/\/+$/, "")}.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="mr-2 h-4 w-4" />
                      編集提案
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="lg:hidden mb-6">
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <Button
                    variant="ghost"
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="w-full flex justify-between items-center p-0 hover:bg-transparent"
                  >
                    <CardTitle className="text-lg">目次</CardTitle>
                    {isTocOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </CardHeader>
                {isTocOpen && (
                  <CardContent>
                    <nav>
                      <ul className="space-y-2">
                        {tableOfContents.map((heading, index) => (
                          <li
                            key={index}
                            className={`${heading.level === 2 ? "ml-4" : ""}`}
                          >
                            <Link
                              href={`#${heading.id}`}
                              className="text-primary hover:text-primary/80 transition-colors block py-1 px-2 rounded hover:bg-accent/50"
                              onClick={() => setIsTocOpen(false)}
                            >
                              <span className="text-sm">{heading.text}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                )}
              </Card>
            </div>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className={"prose prose-invert max-w-none"}
                  components={{
                    p({ children }) {
                      // テーブル内容が含まれている場合はデフォルトの処理に委ねる
                      if (
                        typeof children === "string" &&
                        children.includes("|")
                      ) {
                        return <p>{children}</p>;
                      }

                      if (
                        typeof children === "string" &&
                        children.startsWith("https://")
                      ) {
                        const ogp = ogpMap[children];
                        if (ogp) {
                          return <OGPCard ogp={ogp} />;
                        } else {
                          return <a href={children}>{children}</a>;
                        }
                      }

                      if (Array.isArray(children)) {
                        return children.map((child, index) => {
                          if (
                            typeof child === "string" &&
                            child.startsWith("https://")
                          ) {
                            return (
                              <a
                                key={child}
                                href={child}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {child}
                              </a>
                            );
                          }
                          return <span key={index}>{child}</span>;
                        });
                      }
                      return <p>{children}</p>;
                    },
                    table({ children }) {
                      return (
                        <table className="min-w-full border-collapse border border-gray-600 my-4">
                          {children}
                        </table>
                      );
                    },
                    thead({ children }) {
                      return <thead className="bg-gray-800">{children}</thead>;
                    },
                    tbody({ children }) {
                      return <tbody>{children}</tbody>;
                    },
                    tr({ children }) {
                      return (
                        <tr className="border-b border-gray-600">{children}</tr>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="border border-gray-600 px-4 py-2">
                          {children}
                        </td>
                      );
                    },
                    h2({ children }) {
                      const text =
                        typeof children === "string"
                          ? children
                          : children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      return (
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <h2
                              id={id}
                              className="text-2xl font-bold text-primary"
                            >
                              {children}
                            </h2>
                          </div>
                        </div>
                      );
                    },
                    h3({ children, ...props }) {
                      const text =
                        typeof children === "string"
                          ? children
                          : children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      return (
                        <h3
                          id={id}
                          {...props}
                          className="text-xl font-semibold mt-6 mb-3 text-primary"
                        >
                          {children}
                        </h3>
                      );
                    },
                    code({ inline, className, children }) {
                      const match = /language-(\w+):?(\S*)?/.exec(
                        className || ""
                      );
                      if (!inline && match) {
                        const [_, language, title] = match as unknown as [
                          string,
                          string,
                          string | undefined,
                        ];

                        return (
                          <div className="rounded-lg overflow-hidden">
                            <div className="relative">
                              <div className="absolute top-0 left-0 bg-gray-800 px-2 py-1 text-sm text-gray-300 border-b border-gray-700 font-mono w-auto">
                                {title ?? language}
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    String(children)
                                  );
                                }}
                                className="absolute right-2 top-2 p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
                              >
                                <CopyIcon className="w-4 h-4" />
                              </button>
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={language}
                                title={title}
                                PreTag="div"
                                customStyle={{
                                  paddingTop: "40px",
                                }}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        );
                      }

                      return <code className={className}>{children}</code>;
                    },
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {isTocExpanded && (
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">目次</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTocExpanded(false)}
                        className="h-8 w-8 p-0 hover:bg-accent/50"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <nav>
                      <ul className="space-y-2">
                        {tableOfContents.map((heading, index) => (
                          <li
                            key={index}
                            className={`${heading.level === 2 ? "ml-4" : ""}`}
                          >
                            <Link
                              href={`#${heading.id}`}
                              className="text-primary hover:text-primary/80 transition-colors block py-1 px-2 rounded hover:bg-accent/50"
                            >
                              <span className="text-sm">{heading.text}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>
              )}
              {!isTocExpanded && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTocExpanded(true)}
                  className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  目次を表示
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
