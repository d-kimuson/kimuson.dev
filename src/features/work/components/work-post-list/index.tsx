import React, { memo } from "react"
import { PostDate } from "~/features/blog/components/post-date"
import * as layoutStyles from "~/features/layout/components/layout.module.scss"
import { Image } from "~/functional/image"
import { Link } from "~/functional/link"
import type { WorkPost } from "~/types/post"
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
            <PostDate date={workPost.date} />
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

export const WorkPostList: React.FC<WorkListProps> = ({
  workPosts,
}: WorkListProps) => {
  return (
    <section className={layoutStyles.mainWidth}>
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
