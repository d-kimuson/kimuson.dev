import type { BlogPropsSchema } from "../schemas/blog-props.schema";
import { blogPropsSchema } from "../schemas/blog-props.schema";

export const validateBlogProps = (
  props: unknown,
  url?: string
): BlogPropsSchema => {
  const parsed = blogPropsSchema.safeParse(props);

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

  return parsed.data;
};
