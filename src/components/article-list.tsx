import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import { Article } from "../../types/declaration"

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }: ArticleListProps) => {
  return (
    <div>
      {articles.length > 0
        ? <ul>
          {articles.map(article => (
            <li key={article.slug}>
              <Link to={article.slug}>
                <Image fluid={article.thumbnail} />
                <p>{article.title}</p>
                <p>{article.description}</p>
                <time>{article.date}</time>
              </Link>
            </li>
          ))}
        </ul>
        : <p>記事がありません。</p>
      }
    </div>
  )
}

export default ArticleList
