import React from "react"
import { PageProps } from "gatsby"

import Layout from "../components/layout"
import Head from "../components/head"

const NotFoundPage: React.FC<PageProps> = () => {
  const title = `404: Not Found`
  const description = `ページが見つかりません。`

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <main role="main">
          <section>
            <h1>404 Not Found</h1>
            <p>ページが見つかりません。</p>
          </section>
        </main>
      </Layout>
    </>
  )
}

export default NotFoundPage
