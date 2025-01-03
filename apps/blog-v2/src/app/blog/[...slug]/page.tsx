import { getAllInternalArticles, getArticle, searchArticles } from "articles";
import { ArticlePageContent } from "@/app/blog/[...slug]/page-content";
import { FC } from "react";

type Params = {
  slug: string[];
};

export function generateStaticParams(): Params[] {
  return getAllInternalArticles().map(({ slug }) => ({
    slug: slug.split("/").filter((item) => item !== ""),
  }));
}

const ArticlePage: FC<{ params: Promise<Params> }> = async ({ params }) => {
  const slug = "/" + (await params).slug.join("/");
  const article = getArticle(slug);
  if (article === undefined) throw new Error("404");
  return <ArticlePageContent article={article} />;
};

export default ArticlePage;
