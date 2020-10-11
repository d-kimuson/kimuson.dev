import React from "react"
import { PageProps } from "gatsby"

import Layout from "../components/templates/layout"
import Head from "../components/templates/head"

const NotFoundPage: React.FC<PageProps> = () => {
  const title = `About`
  const description = `Aboutページです。`

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-page-container">
          <main role="main">
            <section>
              <h1 className="m-page-title">About</h1>
              <p>このサイトについて</p>
            </section>
          </main>
        </div>
      </Layout>
    </>
  )
}

export default NotFoundPage
