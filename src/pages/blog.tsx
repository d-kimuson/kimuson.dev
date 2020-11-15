import React from "react"
import { PageProps } from "gatsby"

import Head from "@components/templates/head"
import Layout from "@components/templates/layout"
import Sidebar from "@components/templates/sidebar"
import Search from "@components/molecules/search"

const BlogPage: React.FC<PageProps> = () => {
  const title = `検索`
  const description = `検索することができます。`

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-page-container">
          <div className="l-main-wrapper">
            <main role="main" style={{ width: `100%` }}>
              <section style={{ width: `100%` }}>
                <Search />
              </section>
            </main>
          </div>
          <Sidebar bio={true} commonSidebar={true} />
        </div>
      </Layout>
    </>
  )
}

export default BlogPage
