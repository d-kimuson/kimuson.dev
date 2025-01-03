import classNames from "classnames";
import type { BlogPropsSchema } from "../schemas/blog-props.schema";
import type { FunctionComponent } from "preact";
import { Card } from "../../base/card";
import { useCurrentToc } from "../hooks/use-current-toc";

type TocProps = {
  headings: BlogPropsSchema["headings"];
};

export const Toc: FunctionComponent<TocProps> = ({ headings }) => {
  const currentHeadingSlug = useCurrentToc(headings);

  return (
    <Card title="目次">
      <ul>
        {headings.map(({ depth, slug, text }) => (
          <li key={slug}>
            <a
              href={`#${slug}`}
              className={classNames(
                depth === 2 ? "ms-0" : "ms-6",
                currentHeadingSlug === slug
                  ? "text-sky-blue"
                  : "text-theme-reversed",
                "hover:bg-theme-strong hover:duration-500",
                "px-2 py-1"
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};
