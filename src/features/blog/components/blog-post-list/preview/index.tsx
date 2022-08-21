import classNames from "classnames"
import React from "react"
import { PostDate } from "~/features/blog/components/post-date"
import { SiteLogo } from "~/features/blog/components/site-logo"
import { TagList } from "~/features/blog/components/tag-list"
import * as layoutStyles from "~/features/layout/components/layout.module.scss"
import { Image } from "~/functional/image"
import { Link } from "~/functional/link"
import { toBlogPostLink } from "~/service/links"
import type { BlogPost, FeedPost } from "~/types/post"
import * as styles from "./preview.module.scss"

type BlogPostPreviewProps = {
  blogPost: BlogPost | FeedPost
}

const imgStyle = { height: 90, width: 120 }

const Inner: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return (
    <>
      <div className={styles.imageWrapper}>
        {blogPost.__typename === `BlogPost` ? (
          typeof blogPost.thumbnail === `object` ? (
            <Image image={blogPost.thumbnail} className={styles.image} alt="" />
          ) : (
            <div style={imgStyle}></div>
          )
        ) : (
          <SiteLogo siteName={blogPost.siteName} className={styles.image} />
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
          <PostDate date={blogPost.date} />
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
      className={classNames(
        styles.blogPost,
        "m-card",
        layoutStyles.mainWidth,
        "m-remove-a-decoration"
      )}
    >
      <Inner blogPost={blogPost} />
    </Link>
  ) : (
    <a
      href={blogPost.slug}
      className={classNames(
        styles.blogPost,
        "m-card",
        layoutStyles.mainWidth,
        "m-remove-a-decoration"
      )}
    >
      <Inner blogPost={blogPost} />
    </a>
  )
}
