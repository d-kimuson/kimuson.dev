import { z } from "zod";
import { siteConfig } from "~/config/site";
import type { ArticleCommon } from "~/domain-object/article/article-common";
import { tagSchema } from "~/domain-object/tag";
import type { Tag } from "~/domain-object/tag";
import { isoString } from "~/lib/zod/custom-schema.schema";

export type InternalArticle = ArticleCommon & {
  kind: "internal";
  tags: Tag[];
  draft: boolean;
};

export const blogFrontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string(),
    tags: z.array(tagSchema).optional(),
    date: isoString(),
    draft: z.boolean(),
  })
  .transform(
    ({ tags, date, thumbnail, ...parsed }): Omit<InternalArticle, "url"> => ({
      ...parsed,
      kind: "internal",
      siteName: "kimuson.dev",
      thumbnail: `/assets/${thumbnail}`,
      date: new Date(date),
      tags: tags ?? [],
    })
  );

export const buildInternalArticle = (
  frontmatter: Record<string, unknown>,
  url: string
): InternalArticle => {
  const parsed = blogFrontmatterSchema.safeParse(frontmatter);
  if (!parsed.success) {
    console.error(
      url,
      "の記事ファイルの frontmatter がスキーマを満たしていません"
    );
    console.error("issues", parsed.error.issues);
    const unionErrors = parsed.error.issues.flatMap((issue) =>
      "unionError" in issue ? [issue["unionError"]] : []
    );
    if (unionErrors.length > 0) {
      console.error("unionErrors", unionErrors);
    }

    throw new Error("ZodValidation Error");
  }

  return {
    ...parsed.data,
    url,
  };
};

export const fullUrl = ({ url }: Pick<InternalArticle, "kind" | "url">) =>
  new URL(url, siteConfig.baseUrl).href;
