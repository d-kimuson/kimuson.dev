const siteName = `きむそん.dev`;
const siteDomain = `kimuson.dev`;
const siteUrl = `https://${siteDomain}`;
const description = `技術ブログです。特にWebについて書いています.`;

module.exports = {
  siteMetadata: {
    title: siteName,
    author: {
      name: `Kaito Kimura`,
      summary: `会津大学の学部4年生です。Webに興味があります。`,
    },
    description: description,
    siteUrl: siteUrl,
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
              toasterText: 'コピーされました。',
              toasterDuration: 500
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
        trackingId: `UA-178458800-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteName,
        short_name: siteName,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/icon.png`,
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
