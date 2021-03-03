import React, { memo } from "react"
import { Link } from "gatsby"

import { toTagLink } from "~/service/presenters/links"

interface TagInnerProps {
  tag: string
  className?: string
}

const TagInner: React.VFC<TagInnerProps> = ({
  tag,
  className,
}: TagInnerProps) => (
  <div className={`m-tag ${typeof className === `string` ? className : ``}`}>
    # {tag}
  </div>
)

interface TagProps {
  tag: string
  className?: string
  isLink?: boolean
}

const Component: React.VFC<TagProps> = ({
  tag,
  className,
  isLink = false,
}: TagProps) => {
  return isLink ? (
    <Link to={toTagLink(tag)} className="m-remove-a-decoration m-tag-link">
      <TagInner tag={tag} className={className} />
    </Link>
  ) : (
    <TagInner tag={tag} className={className} />
  )
}

export const Tag = memo(Component)
