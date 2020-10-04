import React from "react"
import { Link } from "gatsby"

import { getTagLink } from "@funcs/links"
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
  <div className={styles.tag}># {tag}</div>
)

const Tag: React.FC<TagProps> = ({ tag, isLink }: TagProps) =>
  isLink ? (
    <Link
      to={getTagLink(tag)}
      className={`m-remove-a-decoration ${styles.tagLink}`}
    >
      <TagInner tag={tag} />
    </Link>
  ) : (
    <span>
      <TagInner tag={tag} />
    </span>
  )

export default Tag
