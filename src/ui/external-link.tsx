import type { FunctionComponent, JSX } from "preact";

type ExternalLinkProps = {
  href: string;
  children: JSX.Element | string;
};

export const ExternalLink: FunctionComponent<ExternalLinkProps> = ({
  href,
  children,
}) => (
  <a
    href={href}
    className="text-sky-blue"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);
