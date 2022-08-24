import React from "react"
import { BlogPostList } from "~/features/blog/components/blog-post-list"
import { CommonLayout } from "~/features/layout/components/common-layout"
import type { BlogPost } from "~/types/post"

type TagPageContentProps = {
  tag: string
  blogPosts: BlogPost[]
}

export const TagPageContent: React.FC<TagPageContentProps> = ({
  tag,
  blogPosts,
}) => {
  return (
    <CommonLayout>
      <h1 className="m-page-title">タグ: {tag}</h1>
      <BlogPostList blogPosts={blogPosts} />
    </CommonLayout>
  )
}
