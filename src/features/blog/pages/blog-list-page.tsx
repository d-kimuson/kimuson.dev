import type { FunctionalComponent } from "preact";
import type { Article } from "~/domain-object/article";
import { BlogList } from "../components/blog-list";
import { useSearch } from "../hooks/use-search";

type BlogListPageProps = {
  articles: Article[];
};

export const BlogListPage: FunctionalComponent<BlogListPageProps> = ({
  articles,
}) => {
  const { filteredArticles, onSubmit, register } = useSearch(articles);

  return (
    <main className="px-8 text-theme-reversed">
      <form
        onSubmit={onSubmit}
        className="border-b-2 border-theme-reversed w-full px-8"
      >
        <input
          {...register("keyword")}
          className="text-theme-reversed bg-theme py-5 w-full text-3xl"
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
