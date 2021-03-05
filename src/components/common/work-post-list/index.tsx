import React, { memo } from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import * as styles from "./work-post-list.module.scss"
import type { WorkPost } from "~/service/entities/post"
import { toFluidImage } from "~/service/gateways/image"
import { Date } from "~/components/atoms/date"
import { comparePost } from "~/utils/compare/entities"

interface WorkPreviewProps {
  workPost: WorkPost
}

const imgStyle = { height: `200px`, width: `300px` }

const WorkPreview: React.VFC<WorkPreviewProps> = ({
  workPost,
}: WorkPreviewProps) => {
  const thumbnail = toFluidImage(workPost.thumbnail)

  return (
    <Link to={workPost.slug} className={`m-remove-a-decoration`}>
      <div className={`m-card ${styles.workPreview}`}>
        {typeof thumbnail !== `undefined` ? (
          <Image
            fluid={thumbnail}
            imgStyle={imgStyle}
            className={styles.image}
          />
        ) : (
          <div style={imgStyle} className={styles.image}></div>
        )}
        <div className={styles.infoContainer}>
          <div>
            <Date date={workPost.date} />
          </div>
          <h2 className={styles.title}>
            {workPost.draft ? <span>[非公開]</span> : null}
            {workPost.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}

const WorkPreviewMemorized = memo(WorkPreview, (prev, next) =>
  comparePost(prev.workPost, next.workPost)
)

interface WorkListProps {
  workPosts: WorkPost[]
}

const Component: React.VFC<WorkListProps> = ({ workPosts }: WorkListProps) => {
  return (
    <section className="l-main-width">
      {workPosts.length > 0 ? (
        <ul className={styles.workList}>
          {workPosts.map((workPost) => (
            <li
              key={workPost.slug}
              className="animate__animated animate__fadeIn"
            >
              <WorkPreviewMemorized workPost={workPost} />
            </li>
          ))}
        </ul>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}

export const WorkPostList = memo(Component)
