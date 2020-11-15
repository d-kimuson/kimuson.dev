import React from "react"

import type { BlogPost } from "@declaration"
import BlogPostPreview from "./blog-post-preview"
// @ts-ignore
import styles from "./blog-post-list.module.scss"

interface BlogPostListProps {
  blogPosts: BlogPost[]
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  blogPosts,
}: BlogPostListProps) => {
  return (
    <section>
      {blogPosts.length > 0 ? (
        <ul className={styles.blogPostList}>
          {blogPosts.map(blogPost => (
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

export default BlogPostList
