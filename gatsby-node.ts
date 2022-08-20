import path from "path"
import { createFilePath } from "gatsby-source-filesystem"
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import type { AllMdxQuery, MdxEdge } from "@graphql-types"
import type {
  CreateWebpackConfigArgs,
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  PluginOptions,
  PluginCallback,
} from "gatsby"
import {
  toBlogPostLink,
  toWorkPostLink,
  toCategoryLink,
  toTagLink,
} from "./src/service/presenters/links"
import { filterDraftPostList } from "./src/service/presenters/post"

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}: CreateWebpackConfigArgs): void => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  })
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions

  const blogPost = path.resolve(__dirname, `src/templates/blog-post.tsx`)
  const workPost = path.resolve(__dirname, `src/templates/work-post.tsx`)

  const result = await graphql<AllMdxQuery>(`
    query AllMdx {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              draft
              category
              tags
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const posts = filterDraftPostList(
    (result.data?.allMdx.edges ?? [])
      .filter((e): e is MdxEdge => typeof e !== `undefined`)
      .map((e) => ({
        title: e.node.frontmatter.title,
        draft: Boolean(e.node.frontmatter.draft),
        slug: e.node.fields?.slug,
        category: e.node.frontmatter.category,
        tags: e.node.frontmatter.tags,
        node: e.node,
      }))
  )

  const blogPosts = posts
    .filter((post) => post.slug?.includes(`/blog/`))
    .filter((post) => typeof post.title === `string`)
    .filter((post) => typeof post.category === `string`)

  const workPosts = posts
    .filter((post) => post.slug?.includes(`/work/`))
    .filter((post) => typeof post.title === `string`)

  // ブログ記事ページ
  blogPosts.forEach((post) => {
    const slug = post.slug

    if (!slug || !post.category) {
      console.log(`slug or category が存在しないのでスキップします`)
      return
    }

    createPage({
      path: toBlogPostLink(slug),
      component: blogPost,
      context: {
        slug: slug,
        category: post.category,
      },
    })
  })

  // Work記事ページ
  workPosts.forEach((post, index) => {
    const slug = post.slug

    if (!slug) {
      console.log(`slug が存在しないのでスキップします`)
      return
    }

    const previous =
      index === workPosts.length - 1 ? null : workPosts[index + 1]?.node
    const next = index === 0 ? null : workPosts[index - 1]?.node

    createPage({
      path: toWorkPostLink(slug),
      component: workPost,
      context: {
        slug: slug,
        previous,
        next,
      },
    })
  })

  // カテゴリページ
  const categories = blogPosts.map((post) => post.node.frontmatter.category)

  Array.from(new Set(categories)).forEach((category) => {
    if (!category) {
      return
    }

    createPage({
      path: toCategoryLink(category),
      component: path.resolve(__dirname, `src/templates/category.tsx`),
      context: {
        category: category,
      },
    })
  })

  // タグページ
  const tags = blogPosts.flatMap((post) => post.node.frontmatter.tags)

  Array.from(new Set(tags)).forEach((tag) => {
    if (!tag) {
      return
    }

    createPage({
      path: toTagLink(tag),
      component: path.resolve(__dirname, `src/templates/tag.tsx`),
      context: {
        tag: tag,
      },
    })
  })
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

type CreateSchemaCustomization = {
  // GatsbyNode["createSchemaCustomization"] だと引数の型が割当されない
  // 各オーバーライド実装の戻り値型が異なるから割当が出来てない(?)
  // とりあえず自前の実装に合うように定義する
  (
    args: CreateSchemaCustomizationArgs,
    options: PluginOptions,
    callback: PluginCallback
  ): void
}

export const createSchemaCustomization: CreateSchemaCustomization = ({
  actions,
}) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: `fileByDataPath`,
    extend: () => ({
      resolve: function (
        src: { thumbnail?: string }, // @ts-expect-error -- a
        args, // @ts-expect-error -- a
        context, // @ts-expect-error -- a
        info // eslint-disable-line @typescript-eslint/no-unused-vars
      ): void {
        const partialPath = src.thumbnail
        if (!partialPath) {
          return
        }

        let filePath
        if (
          partialPath.includes(`work/`) ||
          partialPath.includes(`blog/`) ||
          partialPath.includes(`about/`)
        ) {
          // content からの相対パスを適用する
          filePath = path.join(__dirname, `content`, partialPath)
        } else {
          // content/assets からの相対パスを適用する
          filePath = path.join(__dirname, `content/assets`, partialPath)
        }

        const fileNode = context.nodeModel.runQuery({
          firstOnly: true,
          type: `File`,
          query: {
            filter: {
              absolutePath: {
                eq: filePath,
              },
            },
          },
        })

        if (!fileNode) {
          console.log(
            `サムネ画像(${partialPath} => ${filePath})は見つかりませんでした.`
          )
          return
        }

        return fileNode
      },
    }),
  })

  const typeDefs = `
    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
    }
    type MdxFrontmatter {
      thumbnail: File @fileByDataPath
    }
  `

  createTypes(typeDefs)
}
