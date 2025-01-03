import { useCallback, useState } from "preact/hooks";
import type { FunctionalComponent } from "preact";
import { isContainKeyword, type Article } from "~/domain-object/article";
import { useForm } from "~/lib/form/use-form";
import { BlogList } from "../components/blog-list";

type BlogListPageProps = {
  articles: Article[];
};

export const BlogListPage: FunctionalComponent<BlogListPageProps> = ({
  articles,
}) => {
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handleChange = useCallback(
    (keyword: string) => {
      if (keyword === "") {
        setFilteredArticles(articles);
        return;
      }

      setFilteredArticles(
        articles.filter((article) => isContainKeyword(article, keyword))
      );
    },
    [articles]
  );

  const { register, handleSubmit } = useForm({
    keyword: {
      type: "string",
      default: "",
      onInput: (value) => {
        handleChange(value);
      },
    },
  });

  const onSubmit = handleSubmit((data) => {
    handleChange(data.keyword);
  });

  return (
    <main className="bg-theme px-8 text-theme-reversed">
      <form onSubmit={onSubmit}>
        <input
          {...register("keyword")}
          className="text-theme"
          placeholder="検索する"
        />
      </form>

      <div>
        <BlogList
          articles={filteredArticles
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))}
        />
      </div>
    </main>
  );
};
