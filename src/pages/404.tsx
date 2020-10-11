import React from "react"
import { PageProps } from "gatsby"

import Layout from "../components/templates/layout"
import Head from "../components/templates/head"
import Sidebar from "../components/templates/sidebar"

const NotFoundPage: React.FC<PageProps> = () => {
  const title = `404: Not Found`
  const description = `ページが見つかりません。`

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
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
      </Layout>
    </>
  )
}

export default NotFoundPage
