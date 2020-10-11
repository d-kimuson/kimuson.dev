import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import Date from "../atoms/date"
import { Article } from "@declaration"
import TagList from "./tag-list"
import { getArticleLink } from "@funcs/links"
import { toGatsbyImageFluidArg } from "@funcs/image"
// @ts-ignore
import styles from "./article-list-row.module.scss"

interface ArticlePreviewProps {
  article: Article
}

const imgStyle = { height: `200px`, width: `300px` }

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
}: ArticlePreviewProps) => {
  return (
    <Link
      to={getArticleLink(article.slug)}
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
  return (
    <section>
      <h1>Related Articles</h1>
      {articles.length > 0 ? (
        <ul className={styles.articleList}>
          {articles.map(article => (
            <li
              key={article.slug}
              className={`animate__animated animate__fadeIn ${styles.preview}`}
            >
              <ArticlePreview article={article} />
            </li>
          ))}
        </ul>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}

export default ArticleListRow
