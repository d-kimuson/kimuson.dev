import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import type { BlogPost, FeedPost } from "@entities/post"
import { toBlogPostLink } from "@presenters/links"
import { Date } from "../atoms/date"
import { SiteLogo } from "../atoms/site-logo"
import { TagList } from "./tag-list"
// @ts-ignore
import styles from "./blog-post-preview.module.scss"

interface BlogPostPreviewProps {
  blogPost: BlogPost | FeedPost
}

const imgStyle = { height: `90px`, width: `120px` }

const Inner: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return (
    <>
      <div className={styles.imageWrapper}>
        {blogPost.__typename === `BlogPost` ? (
          typeof blogPost.thumbnail === `object` ? (
            <Image
              fluid={blogPost.thumbnail}
              className={styles.image}
              imgStyle={imgStyle}
            />
          ) : (
            <div style={imgStyle}></div>
          )
        ) : (
          <SiteLogo
            siteName={blogPost.siteName}
            className={styles.image}
            imgStyle={imgStyle}
          />
        )}
      </div>

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
        {blogPost.__typename === `BlogPost` ? (
          <TagList tags={blogPost.tags} />
        ) : null}
      </div>
    </>
  )
}

export const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return blogPost.__typename === `BlogPost` ? (
    <Link
      to={toBlogPostLink(blogPost.slug)}
      className={`${styles.blogPost} m-card l-main-width m-remove-a-decoration`}
    >
      <Inner blogPost={blogPost} />
    </Link>
  ) : (
    <a
      href={blogPost.slug}
      className={`${styles.blogPost} m-card l-main-width m-remove-a-decoration`}
    >
      <Inner blogPost={blogPost} />
    </a>
  )
}
