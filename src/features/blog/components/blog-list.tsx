import { format } from "date-fns";
import type { FunctionalComponent } from "preact";
import type { Article } from "~/domain-object/article";

type BlogListProps = {
  articles: Article[];
};

export const BlogListItem: FunctionalComponent<{
  article: Article;
}> = ({ article }) => (
  <a
    href={article.url}
    className="flex flex-row border-2 border-solid border-white p-7 text-sky-blue"
  >
    <div>
      <p>{article.title}</p>
      <p>{format(article.date, "yyyy年MM月dd日")}</p>
    </div>
  </a>
);

export const BlogList: FunctionalComponent<BlogListProps> = ({ articles }) => (
  <ul>
    {articles.map((article) => (
      <li key={article.url} className="mt-10 first:mt-0">
        <BlogListItem article={article} />
      </li>
    ))}
  </ul>
);
