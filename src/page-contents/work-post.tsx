import React from "react"
import { Post } from "~/features/blog/components/post"
import { CommonLayout } from "~/features/layout/components/common-layout"
import type { Detail, WorkPost } from "~/types/post"

type WorkPostPageContentProps = {
  post: Detail<WorkPost>
}

export const WorkPostPageContent: React.FC<WorkPostPageContentProps> = ({
  post,
}) => {
  return (
    <CommonLayout toc={{ headings: post.headings }}>
      <Post post={post} />
    </CommonLayout>
  )
}
