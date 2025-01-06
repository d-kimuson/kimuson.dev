import { getAllInternalArticles, getArticle } from "@kimuson.dev/articles";
import { ArticlePageContent } from "@/app/blog/[...slug]/page-content";
import { FC } from "react";
import { getOgpMap } from "@/app/blog/[...slug]/opg-image";

type Params = {
  slug: string[];
};

export function generateStaticParams(): Params[] {
  return getAllInternalArticles().map(({ slug }) => ({
    slug: slug
      .split("/")
      .filter((item) => item !== "")
      // slug はすでに encodeURIComponent されているが
      // Next.js は暗黙的に encodeURIComponent をしてくれるが、encodeURIComponent は冪等ではないので齟齬が出る
      // なので generateStaticParams には decode してエンコード前の文字列で渡す
      .map(decodeURIComponent),
  }));
}

const ArticlePage: FC<{ params: Promise<Params> }> = async ({ params }) => {
  const slug = "/" + (await params).slug.join("/");
  const article = getArticle(slug);
  if (article === undefined) throw new Error("404 on " + slug);
  const ogpMap = await getOgpMap(article);

  return <ArticlePageContent article={article} ogpMap={ogpMap} />;
};

export default ArticlePage;
