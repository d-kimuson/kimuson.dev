import React from "react"

import Tag from "./tag"
import styles from "./tag-list.module.scss"

interface TagListProps {
  tags: string[]
  isLink: boolean
}

const TagList: React.FC<TagListProps> = ({ tags, isLink }: TagListProps) => (
  <ul className={styles.tagList}>
    {tags.map(tag => (
      <li key={tag}>
        <Tag tag={tag} isLink={isLink} />
      </li>
    ))}
  </ul>
)

export default TagList
