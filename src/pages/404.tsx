import React from "react"
import type { PageProps } from "gatsby"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Sidebar } from "~/features/layout/components/sidebar"
import { Head } from "~/features/seo/components/head"

const NotFoundPage: React.FC<PageProps> = () => {
  const title = `404: Not Found`
  const description = `ページが見つかりません。`

  return (
    <>
      <Head title={title} description={description} />
      <CommonLayout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main">
              <section>
                <h1 className="m-page-title">404 Not Found</h1>
                <p>ページが見つかりません。</p>
              </section>
            </main>
          </div>
          <Sidebar bio commonSidebar />
        </div>
      </CommonLayout>
    </>
  )
}

export default NotFoundPage
