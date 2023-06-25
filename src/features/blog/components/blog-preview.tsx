import { format } from "date-fns";
import type { FunctionalComponent, JSX } from "preact";
import type { InternalArticleDetail } from "~/domain-object/article/internal-article-detail";
import { SideBar } from "~/features/blog/components/side-bar";

import "preact/debug";

type BlogPreviewProps = {
  articleDetail: InternalArticleDetail;
  children: JSX.Element;
};

export const BlogPreview: FunctionalComponent<BlogPreviewProps> = ({
  articleDetail,
  children,
}) => {
  return (
    <main className="flex justify-center py-7 pr-10 text-theme-reversed">
      <article className="flex max-w-full flex-col bg-theme-weak pl-10 md:w-[80%] md:max-w-[900px] md:px-10">
        <h1 className="text-2xl">{articleDetail.title}</h1>
        <ul>
          {articleDetail.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="flex justify-end">
          {format(articleDetail.date, "yyyy年MM月dd日")}
        </div>
        <div className="m-md-style">{children}</div>
      </article>
      {/* TODO: SideBar は astro から呼ぶべき(hydration 最適化のため) */}
      <SideBar headings={articleDetail.headings} />
    </main>
  );
};
