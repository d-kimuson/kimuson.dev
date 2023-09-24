import { z } from "zod";
import type { ArticleCommon } from "./article-common";
import type { MarkdownHeading } from "astro";
import type { AstroComponentFactory } from "astro/dist/runtime/server";
import type { CollectionEntry } from "astro:content";
import { siteConfig } from "~/config/site";
import { isoString } from "~/lib/zod/custom-schema.schema";
import { tagSchema } from "../tag";

export const internalArticleFrontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string(),
    tags: z.array(tagSchema).optional(),
    date: isoString(),
    draft: z.boolean(),
  })
  .transform(({ tags, date, thumbnail, description, ...parsed }) => ({
    ...parsed,
    description:
      description === "" || description === "まだ書かれていません"
        ? undefined
        : description,
    thumbnail: `/assets/${thumbnail}`,
    date: new Date(date),
    tags: tags ?? [],
  }));

export type InternalArticleFrontmatter = z.infer<
  typeof internalArticleFrontmatterSchema
>;

export type InternalArticleEntry = Omit<
  CollectionEntry<"internal-article">,
  "data"
> & {
  data: InternalArticleFrontmatter;
};

export type InternalArticle = ArticleCommon &
  Pick<InternalArticleEntry, "id" | "collection"> & {
    kind: "internal";
    siteName: "kimuson.dev";
    // changed
    markdownContent: string;
    frontmatter: InternalArticleFrontmatter;
    slug: `blog/${InternalArticleEntry["slug"]}`;
    fullUrl: string;
    summaryContent: string;
    headings: MarkdownHeading[];
    Content: AstroComponentFactory;
  };

export const buildInternalArticle = async (
  entry: InternalArticleEntry
): Promise<InternalArticle> => {
  const { Content, headings } = await entry.render();

  const slug = `blog/${entry.slug}` as const;

  return {
    // common
    title: entry.data.title,
    description: entry.data.description,
    linkUrl: slug,
    fullUrl: new URL(slug, siteConfig.baseUrl).href,
    date: entry.data.date,
    thumbnail: entry.data.thumbnail,
    // astro
    id: entry.id,
    collection: entry.collection,
    // internal-article
    kind: "internal",
    siteName: "kimuson.dev",
    markdownContent: entry.body,
    frontmatter: entry.data,
    slug: slug,
    summaryContent:
      entry.data.description === undefined
        ? (() => {
            const firstSentence = entry.body
              .split("\n")
              .find((content) => content !== "");
            return firstSentence === undefined ? "" : firstSentence + "...";
          })()
        : entry.data.description,
    headings,
    Content,
  } as const;
};
