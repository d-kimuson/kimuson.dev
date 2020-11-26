import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"
import { Swiper, SwiperSlide } from "swiper/react"

import { getBlogPostLink } from "@funcs/links"
import { toGatsbyImageFluidArg } from "@funcs/image"
import { Date } from "../atoms/date"
import { TagList } from "./tag-list"
// @ts-ignore
import styles from "./blog-post-list-row.module.scss"

interface BlogPostPreviewProps {
  blogPost: BlogPost
}

const imgWidth = 300
const imgStyle = { height: `200px`, width: `${imgWidth}px` }

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return (
    <Link
      to={getBlogPostLink(blogPost.slug)}
      className={`m-card l-main-width m-remove-a-decoration ${styles.blogPostLink}`}
    >
      <div className={styles.imageWrapper}>
        {typeof blogPost.thumbnail === `object` ? (
          <Image
            fluid={toGatsbyImageFluidArg(blogPost.thumbnail)}
            imgStyle={imgStyle}
            className={styles.image}
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

interface BlogPostListRowProps {
  blogPosts: BlogPost[]
}

export const BlogPostListRow: React.FC<BlogPostListRowProps> = ({
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
          onSlideChange={(): void => console.log(`slide change`)}
          onSwiper={(swiper): void => console.log(swiper)}
        >
          {blogPosts.map(blogPost => (
            <SwiperSlide tag={`div`} key={blogPost.slug}>
              <BlogPostPreview blogPost={blogPost} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}
