import React from "react"
import { Search } from "~/features/blog-search/components/search"
import type { SearchBlogPost } from "~/features/blog-search/components/search/searchBlogPost"
import { CommonLayout } from "~/features/layout/components/common-layout"
import { Head } from "~/features/seo/components/head"

type BlogPageContentProps = {
  searchBlogPosts: SearchBlogPost[]
}

const title = `ブログ`
const description = `記事の一覧を確認できます。タグやタイトルから記事を検索することができます。`

export const BlogPageContent: React.FC<BlogPageContentProps> = ({
  searchBlogPosts,
}) => {
  return (
    <>
      <Head title={title} description={description} />
      <CommonLayout>
        <Search blogPosts={searchBlogPosts} />
      </CommonLayout>
    </>
  )
}
