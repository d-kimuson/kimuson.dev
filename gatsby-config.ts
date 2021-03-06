import type { MdxEdge, Site } from "@graphql-types"
import { readPosts } from "~/utils/feed"

const siteName = `きむそん.dev`
const siteDomain = `kimuson.dev`
const siteUrl = `https://${siteDomain}`
const description = `技術ブログです。特にWebについて書いています.`

export default {
  siteMetadata: {
    title: siteName,
    author: {
      name: `Kaito Kimura`,
      summary:
        `会津大学の4年生です。` + `Webに関する技術記事をメインに書いていきます`,
    },
    description: description,
    siteUrl: siteUrl,
    social: {
      twitter: `_kimuemon`,
    },
    posts: readPosts(),
  },
  plugins: [
    {
      resolve: `gatsby-plugin-preact`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        plugins: [`gatsby-remark-images`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              removeAccents: true,
              isIconAfterHeader: false,
              elements: [`h2`, `h3`],
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed-mdx`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            // @ts-ignore
            serialize: ({ query: { site, allMdx } }) => {
              const allMdxTyped: { edges: MdxEdge[] } = allMdx
              const siteTyped: Site = site

              return allMdxTyped.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url:
                    siteTyped.siteMetadata?.siteUrl +
                    "/blog" +
                    edge.node.fields?.slug,
                  guid:
                    siteTyped.siteMetadata?.siteUrl +
                    "/blog" +
                    edge.node.fields?.slug,
                  custom_elements: [], // html クエリが帰ってこないので臨時で Issue: https://github.com/gatsbyjs/gatsby/issues/29983
                  // custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { draft: { eq: false } } }
                ) {
                  edges {
                    node {
                      excerpt
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: `${siteName}'s RSS Feed`,
            match: "^/blog/",
          },
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteName,
        short_name: siteName,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/favicon.png`,
      },
    },
    // typescript
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        codegen: process.env.IS_CODEGEN === `true`,
        fileName: `types/graphql-types.d.ts`,
      },
    },
    {
      resolve: `gatsby-plugin-remove-console`,
      options: {
        exclude: [`error`, `warn`],
      },
    },
    // StyleSheets
    `gatsby-plugin-fontawesome-css`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require(`sass`),
        sassRuleTest: /\.scss$/,
        sassRuleModulesTest: /\.module\.scss$/,
        postCssPlugins: [
          require(`autoprefixer`)({
            grid: `autoplace`,
          }),
          require(`postcss-flexbugs-fixes`)({}),
          require(`cssnano`)({ preset: `default` }),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        ignore: [`/src`, `/node_modules/prismjs`],
      },
    },
    // SEO
    {
      resolve: `gatsby-plugin-next-seo`,
      options: {
        openGraph: {
          type: `website`,
          locale: `ja_JP`,
          url: siteUrl,
          site_name: siteName,
        },
        twitter: {
          handle: "@d-kimuson",
          site: "kimuson.dev",
          cardType: "summary_large_image",
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        exclude: [],
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap.xml`,
        env: {
          production: {
            policy: [{ userAgent: `*`, allow: `/` }],
          },
        },
      },
    },
    {
      resolve: "gatsby-plugin-webpack-bundle-analyzer",
      options: {
        analyzerPort: 3000,
        disable: process.env.NODE_ENV !== `production`,
        production: true,
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/*.html": ["Cache-Control: public, max-age=0, must-revalidate"],
          "/page-data/*": ["Cache-Control: public, max-age=0, must-revalidate"],
          "/page-data/app-data.json": [
            "Cache-Control: public, max-age=0, must-revalidate",
          ],
          "/static/*": ["Cache-Control: public, max-age=31536000, immutable"],
          "/sw.js": ["Cache-Control: no-cache"],
          "/**/*.js": ["Cache-Control: public, max-age=31536000, immutable"],
          "/**/*.css": ["Cache-Control: public, max-age=31536000, immutable"],
        },
      },
    },
  ],
}
