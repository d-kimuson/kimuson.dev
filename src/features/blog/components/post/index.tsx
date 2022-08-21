import { MDXRenderer as MDXRendererBase } from "gatsby-plugin-mdx"
import React from "react"
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
import type { MDXRendererProps } from "gatsby-plugin-mdx"
import { PostDate } from "~/features/blog/components/post-date"
import { TagList } from "~/features/blog/components/tag-list"
import { Head } from "~/features/seo/components/head"
import { Image } from "~/functional/image"
import type { Tag } from "~/types/post"
import type { Detail, Post as BasePost } from "~/types/post"
import * as styles from "./post.module.scss"

// FIXME: 非対応なのでやむなく
const MDXRenderer = MDXRendererBase as unknown as React.FC<MDXRendererProps>

export type PostProps<T extends BasePost> = {
  post: Detail<T> & {
    tags?: Tag[]
  }
}

export const Post: React.FC<PostProps<BasePost>> = <T extends BasePost>({
  post,
}: PostProps<T>) => {
  const shareButtonSize = 35

  return (
    <React.Fragment>
      <Head
        title={post.title}
        description={post.description}
        imageUrl={post.ogtImageUrl}
        slug={post.slug}
      />
      <div className={styles.post}>
        <article className={`m-card ${styles.main}`}>
          {typeof post.thumbnail !== `undefined` ? (
            <Image image={post.thumbnail} className={styles.thumbnail} alt="" />
          ) : (
            <div />
          )}
          <div className={styles.contentContainer}>
            <h1 className="m-article-title">
              {post.draft ? `[非公開]` : ``}
              {post.title}
            </h1>

            <div className={styles.articleMetaContainer}>
              {typeof post.tags === `object` ? (
                <div className={styles.tagArea}>
                  <TagList tags={post.tags} isLink={true} />
                </div>
              ) : (
                <div />
              )}
              <PostDate date={post.date} />
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
      </div>
    </React.Fragment>
  )
}
