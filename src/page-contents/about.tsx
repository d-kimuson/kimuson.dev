import React from "react"
import { Post } from "~/features/blog/components/post"
import { CommonLayout } from "~/features/layout/components/common-layout"
import type { AboutPost, Detail } from "~/types/post"

type AboutPageContentProps = {
  post: Detail<AboutPost>
}

export const AboutPageContent: React.FC<AboutPageContentProps> = ({ post }) => {
  return (
    <CommonLayout toc={{ headings: post.headings }}>
      <Post post={post} />
    </CommonLayout>
  )
}
