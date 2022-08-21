import classNames from "classnames"
import React from "react"
import { useRecoilValue } from "recoil"
import { Swiper, SwiperSlide } from "swiper/react"
import { PostDate } from "~/features/blog/components/post-date"
import { TagList } from "~/features/blog/components/tag-list"
import { windowSizeState } from "~/features/global/store/window.store"
import * as layoutStyles from "~/features/layout/components/layout.module.scss"
import { Image } from "~/functional/image"
import { Link } from "~/functional/link"
import { toBlogPostLink } from "~/service/links"
import type { BlogPost } from "~/types/post"
import * as styles from "./blog-post-list-row.module.scss"
import "swiper/css"

type BlogPostPreviewProps = {
  blogPost: BlogPost
}

const imgWidth = 300
const imgMargin = 10
const imgStyle = { height: `200px`, width: `${imgWidth}px` }

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  blogPost,
}: BlogPostPreviewProps) => {
  return (
    <Link
      to={toBlogPostLink(blogPost.slug)}
      className={classNames(
        "m-card",
        layoutStyles.mainWidth,
        "m-remove-a-decoration",
        styles.blogPostLink
      )}
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
          <PostDate date={blogPost.date} />
        </div>
        <h2 className={styles.title}>
          {blogPost.draft ? <span>[非公開]</span> : null}
          {blogPost.title}
        </h2>
      </div>
    </Link>
  )
}

type BlogPostListRowProps = {
  blogPosts: BlogPost[]
}

export const BlogPostListRow: React.FC<BlogPostListRowProps> = ({
  blogPosts,
}) => {
  const windowSize = useRecoilValue(windowSizeState)

  return (
    <section>
      <h1 className={styles.blogPostListTitle}>合わせて読みたい</h1>
      {blogPosts.length > 0 ? (
        <Swiper
          tag={"div"}
          spaceBetween={imgMargin}
          slidesPerView={windowSize / (imgWidth + imgMargin * 2)}
        >
          {blogPosts.map((blogPost) => (
            <SwiperSlide tag={"div"} key={blogPost.slug}>
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
