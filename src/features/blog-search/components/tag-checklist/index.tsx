import React, { useState, memo, useCallback } from "react"
import { Tag } from "~/features/blog/components/tag"
import * as styles from "./tag-checklist.module.scss"

type TagButtonProps = {
  tag: string
  parentSetChecked: (tag: string, isChecked: boolean) => void
}

const TagButton: React.FC<TagButtonProps> = ({
  tag,
  parentSetChecked,
}: TagButtonProps) => {
  const [checked, setChecked] = useState<boolean>(false)

  const handleClick = useCallback(
    (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
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

type TagChecklistProps = {
  tags: string[]
  onUpdate: (selectedTags: string[]) => void
}

const Component: React.FC<TagChecklistProps> = ({
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