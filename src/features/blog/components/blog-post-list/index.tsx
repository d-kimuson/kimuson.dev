import React from "react"
import type { BlogPost, FeedPost } from "~/types/post"
import * as styles from "./blog-post-list.module.scss"
import { BlogPostPreview } from "./preview"

type BlogPostListProps = {
  blogPosts: (BlogPost | FeedPost)[]
}

export const BlogPostList: React.FC<BlogPostListProps> = ({
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
