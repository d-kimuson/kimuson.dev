import React, { useState, memo, useCallback } from "react"

import styles from "./tag-checklist.module.scss"
import { Tag } from "~/components/atoms/tag"

interface TagButtonProps {
  tag: string
  parentSetChecked: (tag: string, isChecked: boolean) => void
}

const TagButton: React.VFC<TagButtonProps> = ({
  tag,
  parentSetChecked,
}: TagButtonProps) => {
  const [checked, setChecked] = useState<boolean>(false)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      console.log(e)
      setChecked(!checked)
      parentSetChecked(tag, !checked)
    },
    [checked, parentSetChecked]
  )

  return (
    <button onClick={handleClick} className={styles.tagButton}>
      <Tag tag={tag} className={checked ? `m-tag--active` : ``} />
    </button>
  )
}

const TagButtonMemorized = memo(TagButton)

interface TagChecklistProps {
  tags: string[]
  onUpdate: (selectedTags: string[]) => void
}

const Component: React.VFC<TagChecklistProps> = ({
  tags,
  onUpdate,
}: TagChecklistProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleClick = useCallback(
    (tag: string, isChecked: boolean): void => {
      let updatedTags
      if (isChecked) {
        updatedTags = selectedTags.concat([tag])
      } else {
        updatedTags = selectedTags.filter((selectedTag) => selectedTag !== tag)
      }
      onUpdate(updatedTags)
      setSelectedTags(updatedTags)
    },
    [onUpdate, selectedTags]
  )

  return (
    <ul className="m-tag-list">
      {tags.map((tag) => (
        <li key={tag}>
          <TagButtonMemorized tag={tag} parentSetChecked={handleClick} />
        </li>
      ))}
    </ul>
  )
}

export const TagChecklist = memo(Component)
