import classNames from "classnames";
import type { FunctionComponent } from "preact";
import { InternalLink } from "~/ui/internal-link";

type ContentsProps = {
  className?: string;
};

export const Contents: FunctionComponent<ContentsProps> = ({ className }) => (
  <div className={classNames(className, "w-full flex flex-col items-center")}>
    <h2 className="text-xl">Contents</h2>

    <ul>
      <li>
        <InternalLink href="/blog">Blog</InternalLink>
      </li>
      <li>
        <InternalLink href="/rss.xml">Feed</InternalLink>
      </li>
    </ul>
  </div>
);
