import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import { WorkPost } from "@declaration"
import Date from "../atoms/date"
import { toGatsbyImageFluidArg } from "@funcs/image"
// @ts-ignore
import styles from "./work-post-list.module.scss"

interface WorkPreviewProps {
  workPost: WorkPost
}

const imgStyle = { height: `200px`, width: `300px` }

const WorkPreview: React.FC<WorkPreviewProps> = ({
  workPost,
}: WorkPreviewProps) => {
  return (
    <Link to={workPost.slug} className={`m-remove-a-decoration`}>
      <div className={`m-card ${styles.workPreview}`}>
        {typeof workPost.thumbnail === `object` ? (
          <Image
            fluid={toGatsbyImageFluidArg(workPost.thumbnail)}
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

interface WorkListProps {
  workPosts: WorkPost[]
}

const WorkList: React.FC<WorkListProps> = ({ workPosts }: WorkListProps) => {
  return (
    <section className="l-main-width">
      {workPosts.length > 0 ? (
        <ul className={styles.workList}>
          {workPosts.map(workPost => (
            <li
              key={workPost.slug}
              className="animate__animated animate__fadeIn"
            >
              <WorkPreview workPost={workPost} />
            </li>
          ))}
        </ul>
      ) : (
        <p>記事がありません。</p>
      )}
    </section>
  )
}

export default WorkList
