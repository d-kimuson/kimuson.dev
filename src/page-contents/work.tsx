import React from "react"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { WorkPostList } from "~/features/work/components/work-post-list"
import type { WorkPost } from "~/types/post"

type WorkPageProps = {
  workPosts: WorkPost[]
}

export const WorkPageContent: React.FC<WorkPageProps> = ({ workPosts }) => {
  return (
    <CommonLayout>
      <h1 className="m-page-title">Works</h1>

      <WorkPostList workPosts={workPosts} />
    </CommonLayout>
  )
}
