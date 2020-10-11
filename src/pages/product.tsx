import React from "react"
import { PageProps } from "gatsby"

import Layout from "../components/templates/layout"
import Head from "../components/templates/head"

const NotFoundPage: React.FC<PageProps> = () => {
  const title = `Product`
  const description = `プロダクトページです。`

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-page-container">
          <main role="main">
            <section>
              <h1 className="m-page-title">Product</h1>
              <p>作品とかとか</p>
            </section>
          </main>
        </div>
      </Layout>
    </>
  )
}

export default NotFoundPage
