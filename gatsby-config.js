module.exports = {
  siteMetadata: {
    title: `Kimuson Blog`,
    author: {
      name: `Kaito Kimura`,
      summary: `ソフトウェアエンジニアです.`,
    },
    description: `技術ブログです.`,
    siteUrl: `https://kimuson.dev/`,
    social: {
      twitter: `_kimuemon`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          "gatsby-remark-code-titles",
          {
            resolve: "gatsby-remark-code-buttons",
            options: {
              toasterText: 'Copied'
            }
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: true,
              noInlineHighlight: true,
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-autolink-headers`
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    // typescript
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-graphql-codegen',
      options: {
        codegen: process.env.IS_CODEGEN === 'true',
        fileName: 'types/graphql-types.d.ts'
      }
    },
    // StyleSheets
    "gatsby-plugin-fontawesome-css",
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require(`sass`),
        sassRuleTest: /\.scss$/,
        sassRuleModulesTest: /\.module\.scss$/,
        postCssPlugins: [
          require(`autoprefixer`)({
            grid: `autoplace`
          }),
          require(`postcss-flexbugs-fixes`)({}),
          require(`cssnano`)({ preset: `default` })
        ]
      }
    },
    "gatsby-transformer-typescript-css-modules",
    // Linter
    {
      resolve: `gatsby-plugin-eslint`,
      options: {
        test: /\.ts$|\.tsx$|\.js$|\.jsx$/,
      }
    },
    {
      resolve: `gatsby-plugin-stylelint`,
      options: {
        syntax: `scss`,
        files: [
          `**/*.scss`,
        ]
      }
    }
  ],
}
