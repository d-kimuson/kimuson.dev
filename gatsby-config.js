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
          {
            resolve: "gatsby-remark-code-titles",
            options: {},
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
              showLineNumbers: true,
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
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
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
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
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
    {
      resolve: "gatsby-plugin-sass",
      options: {
        implementation: require("sass"),
        sassRuleTest: /\.scss$/,
        sassRuleModulesTest: /\.module\.scss$/,
        postCssPlugins: [
          require('autoprefixer')({
            grid: "autoplace"
          }),
          require('postcss-flexbugs-fixes')({}),
          require('cssnano')({ preset: 'default' })
        ]
      }
    },
    // linting
    {
      resolve: "gatsby-plugin-prettier-eslint",
      options: {
        watch: true,
        eslint: {
          patterns: ["src/**/*.{ts,tsx}"],
          customOptions: {
            fix: true,
            cache: true,
          },
        },
      },
    },
    {
      resolve: "@danbruegge/gatsby-plugin-stylelint",
      options: {
        fix: true,
        syntax: 'scss',
        files: [
          "**/*.s?(a|c)ss",
        ]
      }
    }
  ],
}
