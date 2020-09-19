import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import { Article } from "@declaration"
// @ts-ignore
import styles from "./article-preview.module.scss"
import TagList from "./tag-list"

interface ArticlePreviewProps {
  article: Article
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
}: ArticlePreviewProps) => {
  return (
    <Link to={article.slug} className={`${styles.article} m-card`}>
      <Image fluid={article.thumbnail} className={styles.image} />
      <div className={styles.infoContiainer}>
        <h2 className={`title ${article.draft ? styles.draft : ``}`}>
          {article.draft ? `[非公開]` : ``}
          {article.title}
        </h2>
        <time>{article.date}</time>
        <TagList tags={article.tags} isLink={false} />
        <p className="description">{article.description}</p>
      </div>
    </Link>
  )
}

export default ArticlePreview
