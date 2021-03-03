import React, { memo } from "react"

import styles from "./blog-post-list.module.scss"
import type { BlogPost, FeedPost } from "~/service/entities/post"
import { BlogPostPreview } from "./preview"

interface BlogPostListProps {
  blogPosts: (BlogPost | FeedPost)[]
}

const Component: React.VFC<BlogPostListProps> = ({
  blogPosts,
}: BlogPostListProps) => {
  return (
    <section>
      {blogPosts.length > 0 ? (
        <ul className={styles.blogPostList}>
          {blogPosts.map((blogPost) => (
            <li
              key={blogPost.slug}
              className="animate__animated animate__fadeIn"
            >
              <BlogPostPreview blogPost={blogPost} />
            </li>
          ))}
        </ul>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}

export const BlogPostList = memo(Component)
