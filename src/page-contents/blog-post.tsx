import React from "react"
import { BlogPostListRow } from "~/features/blog/components/blog-post-list-row"
import { Post } from "~/features/blog/components/post"
import { CommonLayout } from "~/features/layout/components/common-layout"
import type { BlogPost, Detail } from "~/types/post"

type BlogPostPageContentProps = {
  post: Detail<BlogPost>
  relatedArticles: BlogPost[]
}

export const BlogPostPageContent: React.FC<BlogPostPageContentProps> = ({
  post,
  relatedArticles,
}) => {
  return (
    <CommonLayout
      toc={{
        headings: post.headings,
      }}
      afterMainChildren={
        relatedArticles.length !== 0 ? (
          <BlogPostListRow blogPosts={relatedArticles} />
        ) : null
      }
    >
      <Post post={post} />
    </CommonLayout>
  )
}
