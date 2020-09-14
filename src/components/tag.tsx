import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTag } from "@fortawesome/free-solid-svg-icons"

// @ts-ignore
import styles from "./tag.module.scss"

interface TagProps {
  tag: string
  isLink: boolean
}

interface TagInnerProps {
  tag: string
}

const TagInner: React.FC<TagInnerProps> = ({ tag }: TagInnerProps) => (
  <div className={styles.tag}>
    <FontAwesomeIcon icon={faTag} />
    {tag}
  </div>
)

const Tag: React.FC<TagProps> = ({ tag, isLink }: TagProps) =>
  isLink ? (
    <Link to={`/tags/${tag}`} className="m-remove-a-decoration">
      <TagInner tag={tag} />
    </Link>
  ) : (
    <span>
      <TagInner tag={tag} />
    </span>
  )

export default Tag
