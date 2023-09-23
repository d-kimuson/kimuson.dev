import { format } from "date-fns";
import type { FunctionalComponent, JSX } from "preact";
import type { InternalArticle } from "~/domain-object/article/internal-article";
import { Label } from "~/features/blog/components/label";
import { SideBar } from "~/features/blog/components/side-bar";

import "preact/debug";

type BlogPreviewPageProps = {
  internalArticle: InternalArticle;
  children: JSX.Element;
};

export const BlogPreviewPage: FunctionalComponent<BlogPreviewPageProps> = ({
  internalArticle,
  children,
}) => {
  return (
    <main className="flex justify-center py-7 pr-10 text-theme-reversed">
      <article className="flex max-w-full flex-col bg-theme-weak pl-10 md:w-[80%] md:max-w-[900px] md:px-10">
        <h1 className="text-2xl">{internalArticle.title}</h1>
        <ul className="flex flex-row">
          {internalArticle.frontmatter.tags.map((tag) => (
            <li key={tag} className="[&:not(:first-child)]:px-1">
              <Label>{`# ${tag}`}</Label>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          {format(internalArticle.date, "yyyy年MM月dd日")}
        </div>
        <div className="m-md-style">{children}</div>
      </article>
      {/* TODO: SideBar は astro から呼ぶべき(hydration 最適化のため) */}
      <SideBar headings={internalArticle.headings} />
    </main>
  );
};
