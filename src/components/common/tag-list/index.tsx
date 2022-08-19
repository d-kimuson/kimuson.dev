import React, { memo } from "react"
import { Tag } from "~/components/atoms/tag"
import * as styles from "./tag-list.module.scss"

type TagListProps = {
  tags: string[]
  isLink?: boolean
}

export const Component: React.VFC<TagListProps> = ({
  tags,
  isLink = false,
}: TagListProps) => {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag) => (
        <li key={tag}>
          <Tag tag={tag} isLink={isLink} />
        </li>
      ))}
    </ul>
  )
}

export const TagList = memo(Component)
