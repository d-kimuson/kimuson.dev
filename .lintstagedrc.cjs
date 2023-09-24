// @ts-check

module.exports = {
  "**/*.{tsx,ts,mts,mcs,mjs,cjs,js,json,md,yml,yaml}": [
    "prettier --write",
    "cspell lint --gitignore --cache",
  ],
};
