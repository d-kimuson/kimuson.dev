import React from "react"
import type { PageProps } from "gatsby"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Head } from "~/features/seo/components/head"
import { NotFoundPageContent } from "~/page-contents/404"

const title = `404: Not Found`
const description = `ページが見つかりません。`

const NotFoundPage: React.FC<PageProps<never>> = () => {
  return (
    <>
      <Head title={title} description={description} />
      <CommonLayout>
        <NotFoundPageContent />
      </CommonLayout>
    </>
  )
}

export default NotFoundPage
