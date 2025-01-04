import * as v from "valibot";
import {
  articleDetailSchema,
  articleSchema,
  contentsSchema,
  externalArticleSchema,
  ossSchema,
  speechSchema,
} from "./schema";

export type Article = v.InferOutput<typeof articleSchema>;
export type ArticleDetail = v.InferOutput<typeof articleDetailSchema>;
export type ExternalArticle = v.InferOutput<typeof externalArticleSchema>;
export type Oss = v.InferOutput<typeof ossSchema>;
export type Speech = v.InferOutput<typeof speechSchema>;

export type Contents = v.InferOutput<typeof contentsSchema>;
