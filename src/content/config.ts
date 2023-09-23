import { defineCollection } from "astro:content";
import { internalArticleFrontmatterSchema } from "~/domain-object/article/internal-article";

const internalArticleCollection = defineCollection({
  type: "content",
  schema: internalArticleFrontmatterSchema,
});

export const collections = {
  "internal-article": internalArticleCollection,
};
