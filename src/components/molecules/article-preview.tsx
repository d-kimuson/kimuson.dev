import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import Date from "../atoms/date"
import TagList from "./tag-list"
import { getArticleLink } from "@funcs/links"
import { Article } from "@declaration"
// @ts-ignore
import styles from "./article-preview.module.scss"

interface ArticlePreviewProps {
  article: Article
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
}: ArticlePreviewProps) => {
  return (
    <Link
      to={getArticleLink(article.slug)}
      className={`${styles.article} m-card l-main-width m-remove-a-decoration`}
    >
      <Image
        fluid={article.thumbnail}
        className={styles.image}
        imgStyle={{ height: `200px`, width: `250px` }}
      />
      <div className={styles.infoContainer}>
        <h2 className={styles.title}>
          {article.draft ? (
            <span className={styles.draft}>[非公開] </span>
          ) : null}
          {article.title}
        </h2>
        <div className={styles.date}>
          <Date date={article.date} />
        </div>
        <TagList tags={article.tags} isLink={false} />
        <p className={styles.description}>{article.description}</p>
      </div>
    </Link>
  )
}

export default ArticlePreview
