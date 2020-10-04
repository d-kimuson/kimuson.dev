import React from "react"
import { PageProps } from "gatsby"

import Head from "../components/templates/head"
import Layout from "../components/templates/layout"
import Sidebar from "../components/templates/sidebar"
import Search from "../components/molecules/search"

interface SearchPageState {
  keyword: string
}

type SearchPageProps = PageProps<{}, {}, SearchPageState | null>

const SearchPage: React.FC<SearchPageProps> = ({
  location,
}: SearchPageProps) => {
  const title = `検索`
  const description = `検索することができます。`

  return (
    <>
      <Head title={title} description={description} />
      <Layout>
        <div className="l-main-wrapper">
          <main role="main" style={{ width: `100%` }}>
            <section style={{ width: `100%` }}>
              <Search initKeyword={location.state?.keyword} />
            </section>
          </main>
        </div>
        <Sidebar bio={true} commonSidebar={true} />
      </Layout>
    </>
  )
}

export default SearchPage
