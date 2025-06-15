import { getAllTags, searchArticles } from "@kimuson.dev/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TagPageContent } from "./page-content";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const articles = await searchArticles({ tags: [decodedTag] });

  if (articles.length === 0) {
    return {
      title: "タグが見つかりません",
      description: "指定されたタグの記事が見つかりませんでした。",
    };
  }

  return {
    title: `${decodedTag}の記事一覧`,
    description: `${decodedTag}タグの記事一覧ページです。${articles.length}件の記事があります。`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const articles = await searchArticles({ tags: [decodedTag] });

  if (articles.length === 0) {
    notFound();
  }

  return <TagPageContent tag={decodedTag} articles={[...articles]} />;
}
