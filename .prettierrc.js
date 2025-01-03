/** @type {import("prettier").Config} */
const prettierConfig = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  plugins: ["prettier-plugin-astro"],
};

export default prettierConfig;
