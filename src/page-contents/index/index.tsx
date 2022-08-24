import React from "react"
import { BlogPostList } from "~/features/blog/components/blog-post-list"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Link } from "~/functional/link"
import type { BlogPost, FeedPost } from "~/types/post"
import * as styles from "./index.module.scss"

type IndexPageContentProps = {
  blogPosts: (BlogPost | FeedPost)[]
}

export const IndexPageContent: React.FC<IndexPageContentProps> = ({
  blogPosts,
}) => {
  return (
    <CommonLayout>
      <h1 className="m-page-title">最近の投稿</h1>

      <BlogPostList blogPosts={blogPosts} />
      <div className={styles.blogLinkWrapper}>
        <Link to="/blog/">もっと記事を見る</Link>
      </div>
    </CommonLayout>
  )
}
