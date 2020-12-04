import React from "react"
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

import { Mdx, MdxFrontmatter } from "@graphql-types"
import { FluidImage } from "@declaration"
import { toGatsbyImageFluidArg } from "@funcs/image"
import { TagList } from "@components/molecules/tag-list"
import { Date } from "@components/atoms/date"
// @ts-ignore
import styles from "./post.module.scss"

interface PostProps {
  postUrl?: string
  title: string
  thumbnail?: FluidImage
  frontmatter?: Pick<MdxFrontmatter, "tags" | "draft" | "date">
  post?: Pick<Mdx, "body">
}

export const Post: React.FC<PostProps> = ({
  postUrl,
  title,
  thumbnail,
  frontmatter,
  post,
}: PostProps) => {
  const shareButtonSize = 35

  const tags = (frontmatter?.tags || []).filter(
    (tag): tag is string => typeof tag === `string`
  )

  return (
    <div className="l-main-wrapper l-main-width">
      <main role="main" className={styles.post}>
        <article className={`m-card ${styles.main}`}>
          {typeof thumbnail === `object` && thumbnail !== null ? (
            <Image
              fluid={toGatsbyImageFluidArg(thumbnail)}
              className={styles.thumbnail}
            />
          ) : (
            <div />
          )}
          <div className={styles.contentContainer}>
            <h1 className="m-page-title">
              {frontmatter?.draft ? `[非公開]` : ``}
              {title}
            </h1>

            <div className={styles.articleMetaContainer}>
              <div className={styles.tagArea}>
                <TagList tags={tags} isLink={true} />
              </div>
              <Date date={frontmatter?.date} />
            </div>

            <div className="m-article-body">
              <MDXRenderer>{post?.body || ``}</MDXRenderer>
            </div>
          </div>

          <hr className={styles.sepLine} />
        </article>

        {postUrl ? (
          <div className={styles.left}>
            <div className={styles.snsArena}>
              <FacebookShareButton url={postUrl}>
                <FacebookIcon size={shareButtonSize} round />
              </FacebookShareButton>

              <LineShareButton url={postUrl}>
                <LineIcon size={shareButtonSize} round />
              </LineShareButton>

              <LinkedinShareButton url={postUrl}>
                <LinkedinIcon size={shareButtonSize} round />
              </LinkedinShareButton>

              <TwitterShareButton title={title} via="_kimuson" url={postUrl}>
                <TwitterIcon size={shareButtonSize} round />
              </TwitterShareButton>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
