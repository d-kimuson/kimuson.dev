import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import { Work } from "@declaration"
import Date from "../atoms/date"
import { toGatsbyImageFluidArg } from "@funcs/image"
// @ts-ignore
import styles from "./work-list.module.scss"

interface WorkPreviewProps {
  work: Work
}

const imgStyle = { height: `200px`, width: `300px` }

const WorkPreview: React.FC<WorkPreviewProps> = ({
  work,
}: WorkPreviewProps) => {
  return (
    <Link to={work.slug} className={`m-remove-a-decoration`}>
      <div className={`m-card ${styles.workPreview}`}>
        {typeof work.thumbnail === `object` ? (
          <Image
            fluid={toGatsbyImageFluidArg(work.thumbnail)}
            imgStyle={imgStyle}
            className={styles.image}
          />
        ) : (
          <div style={imgStyle} className={styles.image}></div>
        )}
        <div className={styles.infoContainer}>
          <div>
            <Date date={work.date} />
          </div>
          <h2 className={styles.title}>
            {work.draft ? <span>[非公開]</span> : null}
            {work.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}

interface WorkListProps {
  works: Work[]
}

const WorkList: React.FC<WorkListProps> = ({ works }: WorkListProps) => {
  return (
    <section className="l-main-width">
      {works.length > 0 ? (
        <ul className={styles.workList}>
          {works.map(work => (
            <li key={work.slug} className="animate__animated animate__fadeIn">
              <WorkPreview work={work} />
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
