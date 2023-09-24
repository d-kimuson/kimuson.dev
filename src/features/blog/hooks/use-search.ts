import { useState, useCallback } from "preact/hooks";
import { isContainKeyword, type Article } from "~/domain-object/article";
import { useForm } from "~/lib/form/use-form";

export const useSearch = (initialArticles: ReadonlyArray<Article>) => {
  const [filteredArticles, setFilteredArticles] = useState(initialArticles);

  const handleChange = useCallback(
    (keyword: string) => {
      console.log("keyword", keyword);
      if (keyword === "") {
        setFilteredArticles(initialArticles);
        return;
      }

      setFilteredArticles(
        initialArticles.filter((article) => isContainKeyword(article, keyword))
      );
    },
    [initialArticles]
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

  return {
    filteredArticles,
    register,
    onSubmit,
  };
};
