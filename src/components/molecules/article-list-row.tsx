import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"
import { Swiper, SwiperSlide } from "swiper/react"

import Date from "../atoms/date"
import { Article } from "@declaration"
import TagList from "./tag-list"
import { getBlogPostLink } from "@funcs/links"
import { toGatsbyImageFluidArg } from "@funcs/image"
// @ts-ignore
import styles from "./article-list-row.module.scss"

interface ArticlePreviewProps {
  article: Article
}

const imgWidth = 300
const imgStyle = { height: `200px`, width: `${imgWidth}px` }

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
}: ArticlePreviewProps) => {
  return (
    <Link
      to={getBlogPostLink(article.slug)}
      className={`m-card l-main-width m-remove-a-decoration ${styles.articleLink}`}
    >
      <div className={styles.imageWrapper}>
        {typeof article.thumbnail === `object` ? (
          <Image
            fluid={toGatsbyImageFluidArg(article.thumbnail)}
            imgStyle={imgStyle}
            className={styles.image}
          />
        ) : (
          <div style={imgStyle} className={styles.image}></div>
        )}
        <div className={styles.tagList}>
          <TagList tags={article.tags} />
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div>
          <Date date={article.date} />
        </div>
        <h2 className={styles.title}>
          {article.draft ? <span>[非公開]</span> : null}
          {article.title}
        </h2>
      </div>
    </Link>
  )
}

interface ArticleListRowProps {
  articles: Article[]
}

const ArticleListRow: React.FC<ArticleListRowProps> = ({
  articles,
}: ArticleListRowProps) => {
  const [windowSize, setWindowSize] = useState<number>(-1)
  useEffect(() => {
    window.addEventListener(`resize`, () => {
      setWindowSize(window.innerWidth)
    })

    setWindowSize(window.innerWidth)
  })

  return (
    <section>
      <h1 className={styles.articleListTitle}>Related Articles</h1>
      {articles.length > 0 ? (
        <Swiper
          tag={`div`}
          spaceBetween={imgWidth * 0.9}
          slidesPerView={Math.floor(windowSize / imgWidth) + 1}
          onSlideChange={(): void => console.log(`slide change`)}
          onSwiper={(swiper): void => console.log(swiper)}
        >
          {articles.map(article => (
            <SwiperSlide tag={`div`} key={article.slug}>
              <ArticlePreview article={article} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}

export default ArticleListRow
