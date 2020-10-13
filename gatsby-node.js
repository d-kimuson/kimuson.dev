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
  const workPost = path.resolve(`./src/templates/work-post.tsx`)
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
  const postsNotDraft = result.data.allMarkdownRemark.edges
    .filter(post => (
      process.env.NODE_ENV === 'development' ||
      (typeof post.node.frontmatter.draft === 'boolean'
        && !post.node.frontmatter.draft
      )
    ))
  
  const blogPosts = postsNotDraft
    .filter(post => post.node.fields.slug.includes(`/blog/`))
    .filter(post => typeof post.node.frontmatter.title === `string`)
    .filter(post => typeof post.node.frontmatter.category === `string`)
  
  const workPosts = postsNotDraft
    .filter(work => work.node.fields.slug.includes(`/work/`))

  // Blog Posts
  blogPosts.forEach((post, index) => {
    createPage({
      path: post.node.fields.slug.toLowerCase(),
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        category: post.node.frontmatter.category,
      },
    })
  })

  // Work Posts
  workPosts.forEach((post, index) => {
    const previous = index === workPosts.length - 1 ? null : workPosts[index + 1].node
    const next = index === 0 ? null : workPosts[index - 1].node

    createPage({
      path: post.node.fields.slug.toLowerCase(),
      component: workPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // カテゴリページ
  const category = blogPosts
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
  const tags = blogPosts
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

        let filePath
        if (partialPath.includes(`/work/`) || partialPath.includes(`/blog/`) || partialPath.includes(`/about/`)) {
          // content からの相対パスを適用する
          filePath = path.join(__dirname, 'content', partialPath)
        } else {
          // content/assets からの相対パスを適用する
          filePath = path.join(__dirname, 'content/assets', partialPath)
        }

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
          console.log(`サムネ画像(${partialPath} => ${filePath})は見つかりませんでした.`)
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