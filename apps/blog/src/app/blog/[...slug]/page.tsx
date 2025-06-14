import { getAllInternalArticles, getArticle } from "@kimuson.dev/articles";
import { ArticlePageContent } from "@/app/blog/[...slug]/page-content";
import { FC } from "react";
import { getOgpMap } from "@/app/blog/[...slug]/opg-image";
import { getOgpImagePath } from "@/lib/ogp-utils";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const slug = "/" + (await params).slug.join("/");
  const article = getArticle(slug);

  if (!article) {
    return {
      title: "記事が見つかりません",
    };
  }

  const ogpImagePath = getOgpImagePath(slug);
  const siteUrl = siteConfig.baseUrl;
  const fullUrl = `${siteUrl}/blog${slug}`;
  const ogpImageUrl = `${siteUrl}${ogpImagePath}`;

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: fullUrl,
      siteName: siteConfig.title,
      images: [
        {
          url: ogpImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: "ja_JP",
      type: "article",
      publishedTime: article.date.toISOString(),
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogpImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

const ArticlePage: FC<{ params: Promise<Params> }> = async ({ params }) => {
  const slug = "/" + (await params).slug.join("/");
  const article = getArticle(slug);
  if (article === undefined) throw new Error("404 on " + slug);
  const ogpMap = await getOgpMap(article);

  return <ArticlePageContent article={article} ogpMap={ogpMap} />;
};

export default ArticlePage;
