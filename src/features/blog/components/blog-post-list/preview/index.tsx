import React, { memo } from "react"
import { PostDate } from "~/features/blog/components/post-date"
import { SiteLogo } from "~/features/blog/components/site-logo"
import { TagList } from "~/features/blog/components/tag-list"
import { Image } from "~/functional/image"
import { Link } from "~/functional/mdx/link"
import type { BlogPost, FeedPost } from "~/service/entities/post"
import { toBlogPostLink } from "~/service/presenters/links"
import { comparePost } from "~/utils/compare/entities"
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

const InnerMemorized = memo(Inner, (prev, next) => {
  return comparePost(prev.blogPost, next.blogPost)
})

export const Component: React.FC<BlogPostPreviewProps> = ({
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
