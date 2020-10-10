import React from "react"
import { Link } from "gatsby"

import { getTagLink } from "@funcs/links"

interface TagInnerProps {
  tag: string
  className?: string
}

const TagInner: React.FC<TagInnerProps> = ({
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

const Tag: React.FC<TagProps> = ({
  tag,
  className,
  isLink = false,
}: TagProps) => {
  return isLink ? (
    <Link to={getTagLink(tag)} className="m-remove-a-decoration m-tag-link">
      <TagInner tag={tag} className={className} />
    </Link>
  ) : (
    <TagInner tag={tag} className={className} />
  )
}

export default Tag
