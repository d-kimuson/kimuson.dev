import { useCallback, useState } from "preact/hooks";
import type { FunctionalComponent } from "preact";
import { isContainKeyword, type Article } from "~/domain-object/article";
import { BlogList } from "~/features/blog/components/blog-list";
import { useForm } from "~/lib/form/use-form";

type BlogListPageProps = {
  articles: Article[];
};

export const BlogListPage: FunctionalComponent<BlogListPageProps> = ({
  articles,
}) => {
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handleChange = useCallback(
    (keyword: string) => {
      console.log("keyword", keyword);
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
    <main className="text-theme-reversed px-5">
      <form
        onSubmit={onSubmit}
        className="border-b-2 border-theme-reversed w-full px-8"
      >
        <input
          {...register("keyword")}
          className="text-theme-reversed bg-theme-weak py-5 w-full"
          placeholder="検索する"
        />
      </form>

      <div className="mt-4">
        <BlogList
          articles={filteredArticles
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))}
        />
      </div>
    </main>
  );
};
