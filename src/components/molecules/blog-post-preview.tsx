import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import { getBlogPostLink } from "@funcs/links"
import { toGatsbyImageFluidArg } from "@funcs/image"
import { Date } from "../atoms/date"
import { TagList } from "./tag-list"
// @ts-ignore
import styles from "./blog-post-preview.module.scss"

interface BlogPostPreviewProps {
  blogPost: BlogPost
}

const imgStyle = { height: `90px`, width: `120px` }

export const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return (
    <Link
      to={getBlogPostLink(blogPost.slug)}
      className={`${styles.blogPost} m-card l-main-width m-remove-a-decoration`}
    >
      {typeof blogPost.thumbnail === `object` ? (
        <div className={styles.imageWrapper}>
          <Image
            fluid={toGatsbyImageFluidArg(blogPost.thumbnail)}
            className={styles.image}
            imgStyle={imgStyle}
          />
        </div>
      ) : (
        <div style={imgStyle}></div>
      )}
      <div className={styles.infoContainer}>
        <h2 className={styles.title}>
          {blogPost.draft ? (
            <span className={styles.draft}>[非公開] </span>
          ) : null}
          {blogPost.title}
        </h2>
        <div className={styles.date}>
          <Date date={blogPost.date} />
        </div>
        <TagList tags={blogPost.tags} />
      </div>
    </Link>
  )
}
