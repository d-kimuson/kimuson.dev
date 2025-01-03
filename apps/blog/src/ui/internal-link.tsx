import type { FunctionComponent, JSX } from "preact";

type InternalLinkProps = {
  href: string;
  children: JSX.Element | string;
};

export const InternalLink: FunctionComponent<InternalLinkProps> = ({
  href,
  children,
}) => (
  <a href={href} className="text-sky-blue">
    {children}
  </a>
);
