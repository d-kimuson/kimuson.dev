import { format } from "date-fns";
import type { Article } from "~/domain-object/article";
import type { FunctionalComponent } from "preact";
import { Label } from "./label";

type BlogListProps = {
  articles: Article[];
};

export const BlogListItem: FunctionalComponent<{
  article: Article;
}> = ({ article }) => {
  const labels =
    article.kind === "internal"
      ? article.frontmatter.tags.map((tag) => `# ${tag}`)
      : [article.siteName];

  return (
    <a
      href={article.fullUrl}
      className="flex flex-row rounded-md bg-theme-weak p-4 text-sky-blue group"
      target={article.kind === "internal" ? undefined : "_blank"}
      rel={article.kind === "internal" ? undefined : "noopener noreferrer"}
    >
      <div className="flex h-28 w-52 items-center justify-center">
        {article.siteName === "Zenn" ? (
          <img
            src="/assets/icons/zenn.svg"
            alt="Zenn"
            className="aspect-[1/1] h-full w-auto group-hover:scale-105 transition-all"
          />
        ) : (
          <img
            src={article.thumbnail}
            alt=""
            className="aspect-auto h-full w-auto group-hover:scale-105 transition-all"
          />
        )}
      </div>
      <div className="flex flex-col justify-center ml-3">
        <p className="pb-2 text-xl group-hover:font-bold">{article.title}</p>
        <p className="pb-2">{format(article.date, "yyyy年MM月dd日")}</p>
        <ul className="flex flex-row">
          {labels.map((label) => (
            <li key={label} className="[&:not(:first-child)]:px-1">
              <Label>{label}</Label>
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
};

export const BlogList: FunctionalComponent<BlogListProps> = ({ articles }) => (
  <ul>
    {articles.map((article) => (
      <li key={article.fullUrl} className="mt-10 first:mt-0">
        <BlogListItem article={article} />
      </li>
    ))}
  </ul>
);
