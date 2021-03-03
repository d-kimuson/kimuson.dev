import React, { memo } from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Image from "gatsby-image"
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share"

import styles from "./post.module.scss"
import type { Detail, Post as BasePost } from "~/service/entities/post"
import type { Tag } from "~/service/entities/post"
import { Head } from "~/components/common/head"
import { TagList } from "~/components/common/tag-list"
import { Date } from "~/components/atoms/date"
import { comparePost } from "~/utils/compare/entities"

interface PostProps<T extends BasePost> {
  post: Detail<T> & {
    tags?: Tag[]
  }
}

const Component: React.VFC<PostProps<BasePost>> = <T extends BasePost>({
  post,
}: PostProps<T>) => {
  const shareButtonSize = 35

  return (
    <>
      <Head
        title={post.title}
        description={post.description}
        imageUrl={post.ogtImageUrl}
        slug={post.slug}
      />
      <div className="l-main-wrapper l-main-width">
        <main role="main" className={styles.post}>
          <article className={`m-card ${styles.main}`}>
            {typeof post.thumbnail !== `undefined` ? (
              <Image fluid={post.thumbnail} className={styles.thumbnail} />
            ) : (
              <div />
            )}
            <div className={styles.contentContainer}>
              <h1 className="m-article-title">
                {post.draft ? `[非公開]` : ``}
                {post.title}
              </h1>

              <div className={styles.articleMetaContainer}>
                {typeof post?.tags === `object` ? (
                  <div className={styles.tagArea}>
                    <TagList tags={post.tags} isLink={true} />
                  </div>
                ) : (
                  <div />
                )}
                <Date date={post.date} />
              </div>

              <div className="m-article-body">
                <MDXRenderer>{post.body || ``}</MDXRenderer>
              </div>
            </div>
          </article>

          {post.postUrl ? (
            <div className={styles.left}>
              <div className={styles.snsArena}>
                <FacebookShareButton url={post.postUrl}>
                  <FacebookIcon size={shareButtonSize} round />
                </FacebookShareButton>

                <LineShareButton url={post.postUrl}>
                  <LineIcon size={shareButtonSize} round />
                </LineShareButton>

                <LinkedinShareButton url={post.postUrl}>
                  <LinkedinIcon size={shareButtonSize} round />
                </LinkedinShareButton>

                <TwitterShareButton
                  title={post.title}
                  via="_kimuson"
                  url={post.postUrl}
                >
                  <TwitterIcon size={shareButtonSize} round />
                </TwitterShareButton>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </>
  )
}

export const Post = memo(Component, (prev, next) =>
  comparePost(prev.post, next.post)
)
