module.exports = {
  "./**/*.{ts,tsx}": ["eslint --cache --fix"],
  "./**/*.{css,scss}": ["stylelint --cache --fix"],
  "./**/*.{ts,tsx,js,json,css,scss,yml,yaml}": [
    "prettier --write",
    "cspell lint --gitignore --cache",
  ],
}
