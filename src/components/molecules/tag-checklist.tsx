import React, { useState } from "react"

import Tag from "../atoms/tag"
// @ts-ignore
import styles from "./tag-checklist.module.scss"

interface TagButtonProps {
  tag: string
  parentSetChecked: (tag: string, isChecked: boolean) => void
}

const TagButton: React.FC<TagButtonProps> = ({
  tag,
  parentSetChecked,
}: TagButtonProps) => {
  const [checked, setChecked] = useState<boolean>(false)

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    console.log(e)
    setChecked(!checked)
    parentSetChecked(tag, !checked)
  }

  return (
    <button onClick={handleClick} className={styles.tagButton}>
      <Tag tag={tag} className={checked ? `m-tag--active` : ``} />
    </button>
  )
}

interface TagChecklistProps {
  tags: string[]
  onUpdate: (selectedTags: string[]) => void
}

const TagChecklist: React.FC<TagChecklistProps> = ({
  tags,
  onUpdate,
}: TagChecklistProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  return (
    <ul className="m-tag-list">
      {tags.map(tag => (
        <li key={tag}>
          <TagButton
            tag={tag}
            parentSetChecked={(tag, isChecked): void => {
              let updatedTags
              if (isChecked) {
                updatedTags = selectedTags.concat([tag])
              } else {
                updatedTags = selectedTags.filter(tag => tag !== tag)
              }
              onUpdate(updatedTags)
              setSelectedTags(updatedTags)
            }}
          />
        </li>
      ))}
    </ul>
  )
}

export default TagChecklist
