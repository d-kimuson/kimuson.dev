module.exports = {
  extends: [
    "plugin:react/recommended",
    // "plugin:storybook/recommended",
    "./.eslintrc.base.cjs",
  ],
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      webpack: {
        config: {
          resolve: {
            extensions: [".scss"],
          },
        },
      },
    },
  },
  rules: {
    // "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
}
