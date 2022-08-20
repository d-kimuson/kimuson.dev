import React, { memo } from "react"
import { Date } from "~/components/atoms/date"
import { Image } from "~/components/common/image"
import { Link } from "~/components/common/link"
import type { WorkPost } from "~/service/entities/post"
import { comparePost } from "~/utils/compare/entities"
import * as styles from "./work-post-list.module.scss"

type WorkPreviewProps = {
  workPost: WorkPost
}

const imgStyle = { height: `200px`, width: `300px` }

const WorkPreview: React.FC<WorkPreviewProps> = ({
  workPost,
}: WorkPreviewProps) => {
  return (
    <Link to={workPost.slug} className={`m-remove-a-decoration`}>
      <div className={`m-card ${styles.workPreview}`}>
        {typeof workPost.thumbnail !== `undefined` ? (
          <Image
            image={workPost.thumbnail}
            imgStyle={imgStyle}
            className={styles.image}
            alt=""
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

type WorkListProps = {
  workPosts: WorkPost[]
}

const Component: React.FC<WorkListProps> = ({ workPosts }: WorkListProps) => {
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
