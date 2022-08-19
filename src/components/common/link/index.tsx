import { Link as GatsbyLink } from "gatsby"
import type { GatsbyLinkProps } from "gatsby"

type LinkProps = React.PropsWithChildren<
  GatsbyLinkProps<Record<string, unknown>>
>

export const Link: React.VFC<LinkProps> = ({ to, children, className }) => {
  return (
    // @ts-expect-error -- React18 対応ができてないらしいので
    <GatsbyLink to={to} className={className}>
      {children}
    </GatsbyLink>
  )
}
