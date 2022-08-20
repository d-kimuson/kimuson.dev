import React, { useState, useEffect, memo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Date } from "~/components/atoms/date"
import { Image } from "~/components/common/image"
import { Link } from "~/components/common/link"
import { TagList } from "~/components/common/tag-list"
import type { BlogPost } from "~/service/entities/post"
import { toBlogPostLink } from "~/service/presenters/links"
import { comparePost } from "~/utils/compare/entities"
import * as styles from "./blog-post-list-row.module.scss"

type BlogPostPreviewProps = {
  blogPost: BlogPost
}

const imgWidth = 300
const imgStyle = { height: `200px`, width: `${imgWidth}px` }

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return (
    <Link
      to={toBlogPostLink(blogPost.slug)}
      className={`m-card l-main-width m-remove-a-decoration ${styles.blogPostLink}`}
    >
      <div className={styles.imageWrapper}>
        {typeof blogPost.thumbnail === `object` ? (
          <Image
            image={blogPost.thumbnail}
            imgStyle={imgStyle}
            className={styles.image ?? ""}
            alt=""
          />
        ) : (
          <div style={imgStyle} className={styles.image}></div>
        )}
        <div className={styles.tagList}>
          <TagList tags={blogPost.tags} />
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div>
          <Date date={blogPost.date} />
        </div>
        <h2 className={styles.title}>
          {blogPost.draft ? <span>[非公開]</span> : null}
          {blogPost.title}
        </h2>
      </div>
    </Link>
  )
}

const BlogPostPreviewMemorized = memo(BlogPostPreview, (prev, next) =>
  comparePost(prev.blogPost, next.blogPost)
)

type BlogPostListRowProps = {
  blogPosts: BlogPost[]
}

const Component: React.FC<BlogPostListRowProps> = ({
  blogPosts,
}: BlogPostListRowProps) => {
  const [windowSize, setWindowSize] = useState<number>(-1)
  useEffect(() => {
    window.addEventListener(`resize`, () => {
      setWindowSize(window.innerWidth)
    })

    setWindowSize(window.innerWidth)
  })

  return (
    <section>
      <h1 className={styles.blogPostListTitle}>合わせて読みたい</h1>
      {blogPosts.length > 0 ? (
        <Swiper
          tag={`div`}
          spaceBetween={imgWidth * 0.9}
          slidesPerView={Math.floor(windowSize / imgWidth) + 1}
        >
          {blogPosts.map((blogPost) => (
            <SwiperSlide tag={`div`} key={blogPost.slug}>
              <BlogPostPreviewMemorized blogPost={blogPost} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}

export const BlogPostListRow = memo(Component)
