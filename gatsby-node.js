const path = require(`path`)
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      alias: {
        "@styles": path.resolve(__dirname, `src/global-styles`),
        "@modules": path.resolve(__dirname, `src/css-modules`)
      }
    }
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
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
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges
    .filter(post => (
      process.env.NODE_ENV === 'development' ||
      (typeof post.node.frontmatter.draft === 'boolean'
        && !post.node.frontmatter.draft
      )
    ))
  .filter(post => typeof post.node.frontmatter.title === `string`)
  .filter(post => typeof post.node.frontmatter.category === `string`)

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: `/blog${post.node.fields.slug}`.toLowerCase(),
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        category: post.node.frontmatter.category,
        previous,
        next,
      },
    })
  })

  // カテゴリページ
  const category = posts
    .filter(post => typeof post.node.frontmatter.category !== 'undefined')
    .map(post => post.node.frontmatter.category)

  Array.from(new Set(category)).forEach((category, index) => {
    createPage({
      path: `/category/${category}/`.toLowerCase(),
      component: path.resolve('./src/templates/category.tsx'),
      context: {
        category: category
      }
    })
  })

  // タグページ
  const tags = posts
    .filter(post => typeof post.node.frontmatter.tags !== 'undefined')
    .flatMap(post => post.node.frontmatter.tags)

  Array.from(new Set(tags)).forEach((tag, index) => {
    if (tag !== null) {
      createPage({
        path: `/tags/${tag}/`.toLowerCase(),
        component: path.resolve('./src/templates/tag.tsx'),
        context: {
          tag: tag
        }
      })
    }
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: 'fileByDataPath',
    extend: () => ({
      resolve: function (src, args, context, info) {
        const partialPath = src.thumbnail
        if (!partialPath) {
          return null
        }

        const filePath = path.join(__dirname, 'content/assets', partialPath)
        const fileNode = context.nodeModel.runQuery({
          firstOnly: true,
          type: 'File',
          query: {
            filter: {
              absolutePath: {
                eq: filePath
              }
            }
          }
        })

        if (!fileNode) {
          return null
        }

        return fileNode
      }
    })
  })

  const typeDefs = `
    type Frontmatter @infer {
      thumbnail: File @fileByDataPath
    }

    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter
    }
  `

  createTypes(typeDefs)
}