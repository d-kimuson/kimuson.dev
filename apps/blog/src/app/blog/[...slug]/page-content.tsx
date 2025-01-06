"use client";

import { useState, useMemo, FC } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { ChevronDown, ChevronUp, CopyIcon } from "lucide-react";
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
  }> => {
    const headings = article?.content.match(/^##? .+$/gm) || [];
    return headings.map((heading) => ({
      level: heading.startsWith("##") ? 2 : 1,
      text: heading.replace(/^##? /, ""),
    }));
  }, [article]);

  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{article.title} | kimuson.dev</title>
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-gray-400 mb-6">
            {article.date.toLocaleDateString()}{" "}
            {article.date.toLocaleTimeString()}
          </p>
          <div className="mb-4">
            {article.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="mr-2">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mb-6 space-x-4 flex items-center justify-end">
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(`${article.title} | kimuson.dev`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
            </Button>
            <Button variant="outline" size="sm">
              <FaGithub className="mr-2" />
              変更を提案
            </Button>
            <Button variant="outline" size="sm">
              <FaGithub className="mr-2" />
              変更履歴を確認
            </Button>
          </div>
          <div className="md:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="w-full flex justify-between items-center"
            >
              見出し
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
          <ReactMarkdown
            className={"prose prose-invert max-w-none"}
            components={{
              p({ children }) {
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
              h2({ children }) {
                return (
                  <h2 id={children} className="text-2xl font-bold">
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
              code({ inline, className, children }) {
                const match = /language-(\w+):?(\S*)?/.exec(className || "");
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
                            navigator.clipboard.writeText(String(children));
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
        </div>
        <div className="hidden md:block">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4">見出し</h2>
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
    </>
  );
};
