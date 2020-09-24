import React from "react"

import { Article } from "@declaration"
import ArticlePreview from "./article-preview"
// @ts-ignore
import styles from "./article-list.module.scss"

interface ArticleListProps {
  articles: Article[]
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
}: ArticleListProps) => {
  return (
    <section>
      {articles.length > 0 ? (
        <ul className={styles.articleList}>
          {articles.map(article => (
            <li key={article.slug}>
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

export default ArticleList
