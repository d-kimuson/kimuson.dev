import React from "react"
import { BlogPostList } from "~/features/blog/components/blog-post-list"
import { CommonLayout } from "~/features/layout/components/common-layout"
import type { BlogPost, Category } from "~/types/post"

type CategoryPageContentProps = {
  category: Category
  blogPosts: BlogPost[]
}

export const CategoryPageContent: React.FC<CategoryPageContentProps> = ({
  category,
  blogPosts,
}) => {
  return (
    <CommonLayout>
      <h1 className="m-page-title">カテゴリ: {category}</h1>

      <BlogPostList blogPosts={blogPosts} />
    </CommonLayout>
  )
}
