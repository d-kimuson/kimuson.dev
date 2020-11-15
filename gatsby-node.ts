import path from "path"
import type {
  Actions,
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  PluginOptions,
  PluginCallback,
} from "gatsby"
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import { createFilePath } from "gatsby-source-filesystem"

import {
  getBlogPostLink,
  getWorkPostLink,
  getCategoryLink,
  getTagLink,
} from "@funcs/links"
import { filterDraft } from "@funcs/article"
import { AllMdxQuery, MdxEdge } from "@graphql-types"

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}: {
  actions: Actions
}): void => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      alias: {
        "@styles": path.resolve(__dirname, `src/global-styles`),
        "@modules": path.resolve(__dirname, `src/css-modules`),
      },
    },
  })
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const workPost = path.resolve(`./src/templates/work-post.tsx`)

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

  const edges = result?.data?.allMdx.edges.filter(
    (e): e is MdxEdge => typeof e !== `undefined`
  )
  const postsNotDraft = (edges || []).filter(filterDraft)

  const blogPosts = postsNotDraft
    .filter(post => post.node.fields?.slug?.includes(`/blog/`))
    .filter(post => typeof post.node.frontmatter?.title === `string`)
    .filter(post => typeof post.node.frontmatter?.category === `string`)

  const workPosts = postsNotDraft
    .filter(post => post.node.fields?.slug?.includes(`/work/`))
    .filter(post => typeof post.node.frontmatter.title === `string`)

  // ブログ記事ページ
  blogPosts.forEach(post => {
    const slug = post.node.fields?.slug

    if (!slug || !post.node.frontmatter.category) {
      console.log(`slug or category が存在しないのでスキップします`)
      return
    }

    createPage({
      path: getBlogPostLink(slug),
      component: blogPost,
      context: {
        slug: slug,
        category: post.node.frontmatter.category,
      },
    })
  })

  // Work記事ページ
  workPosts.forEach((post, index) => {
    const slug = post.node.fields?.slug

    if (!slug) {
      console.log(`slug が存在しないのでスキップします`)
      return
    }

    const previous =
      index === workPosts.length - 1 ? null : workPosts[index + 1].node
    const next = index === 0 ? null : workPosts[index - 1].node

    createPage({
      path: getWorkPostLink(slug),
      component: workPost,
      context: {
        slug: slug,
        previous,
        next,
      },
    })
  })

  // カテゴリページ
  const categories = blogPosts.map(post => post.node.frontmatter?.category)

  Array.from(new Set(categories)).forEach(category => {
    if (!category) {
      return
    }

    createPage({
      path: getCategoryLink(category),
      component: path.resolve(`./src/templates/category.tsx`),
      context: {
        category: category,
      },
    })
  })

  // タグページ
  const tags = blogPosts.flatMap(post => post.node.frontmatter?.tags)

  Array.from(new Set(tags)).forEach(tag => {
    if (!tag) {
      return
    }

    createPage({
      path: getTagLink(tag),
      component: path.resolve(`./src/templates/tag.tsx`),
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

interface CreateSchemaCustomization {
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
        src: { thumbnail?: string }, // @ts-ignore
        args, // @ts-ignore
        context, // @ts-ignore
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
