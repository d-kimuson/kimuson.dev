import React from "react"
import { Link } from "~/components/common/link"
import { toTagLink } from "~/service/presenters/links"

type TagInnerProps = {
  tag: string
  className?: string | undefined
}

const TagInner: React.FC<TagInnerProps> = ({ tag, className }) => (
  <div className={`m-tag ${typeof className === `string` ? className : ``}`}>
    # {tag}
  </div>
)

type TagProps = {
  tag: string
  className?: string
  isLink?: boolean
}

export const Tag: React.FC<TagProps> = ({ tag, className, isLink = false }) => {
  return isLink ? (
    <Link to={toTagLink(tag)} className="m-remove-a-decoration m-tag-link">
      <TagInner tag={tag} className={className} />
    </Link>
  ) : (
    <TagInner tag={tag} className={className} />
  )
}
