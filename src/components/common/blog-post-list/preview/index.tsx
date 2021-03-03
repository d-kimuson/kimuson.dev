import React, { memo } from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import styles from "./blog-post-preview.module.scss"
import type { BlogPost, FeedPost } from "~/service/entities/post"
import { toBlogPostLink } from "~/service/presenters/links"
import { Date } from "~/components/atoms/date"
import { SiteLogo } from "~/components/atoms/site-logo"
import { TagList } from "~/components/common/tag-list"
import { comparePost } from "~/utils/compare/entities"

interface BlogPostPreviewProps {
  blogPost: BlogPost | FeedPost
}

const imgStyle = { height: `90px`, width: `120px` }

const Inner: React.VFC<BlogPostPreviewProps> = ({
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

const InnerMemorized = memo(Inner, (prev, next) => {
  return comparePost(prev.blogPost, next.blogPost)
})

export const Component: React.VFC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return blogPost.__typename === `BlogPost` ? (
    <Link
      to={toBlogPostLink(blogPost.slug)}
      className={`${styles.blogPost} m-card l-main-width m-remove-a-decoration`}
    >
      <InnerMemorized blogPost={blogPost} />
    </Link>
  ) : (
    <a
      href={blogPost.slug}
      className={`${styles.blogPost} m-card l-main-width m-remove-a-decoration`}
    >
      <InnerMemorized blogPost={blogPost} />
    </a>
  )
}

export const BlogPostPreview = memo(Component)
