module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    quotes: "off",
    "@typescript-eslint/quotes": [
      2,
      "backtick",
      {
        avoidEscape: true,
      },
    ],
    indent: ["error", 2, { SwitchCase: 1 }]
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  ignorePatterns: [
    "gatsby-browser.js",
    "gatsby-config.js",
    "gatsby-node.js",
    ".eslintrc.js",
    ".stylelintrc.js",
    "types/graphql-types.d.ts"
  ],
}
