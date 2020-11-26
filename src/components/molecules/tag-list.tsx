import React from "react"

import { Tag } from "../atoms/tag"
// @ts-ignore
import styles from "./tag-list.module.scss"

interface TagListProps {
  tags: string[]
  isLink?: boolean
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  isLink = false,
}: TagListProps) => {
  return (
    <ul className={styles.tagList}>
      {tags.map(tag => (
        <li key={tag}>
          <Tag tag={tag} isLink={isLink} />
        </li>
      ))}
    </ul>
  )
}
