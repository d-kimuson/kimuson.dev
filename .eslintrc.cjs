module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./**/(tsconfig.src|tsconfig.test|tsconfig).json",
  },
  env: {
    node: true,
    jest: true,
  },
  plugins: ["@typescript-eslint", "import"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    "spaced-comment": [
      "error",
      "always",
      {
        exceptions: [],
      },
    ],
    // あとで対応しよ
    // "no-console": ["error"],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "type",
          "internal",
          "parent",
          "index",
          "sibling",
          "object",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "~/**",
            group: "internal",
            position: "before",
          },
        ],
        alphabetize: {
          order: "asc",
        },
        "newlines-between": "never",
      },
    ],
    // "import/no-restricted-paths": [
    //   "error",
    //   {
    //     zones: [
    //       // sample
    //       // {
    //       //   from: "./src/**/repositories/*.ts",
    //       //   target: "**/**/services/**/*",
    //       //   message: "サービス層はリポジトリ層に依存できない",
    //       // },
    //     ],
    //   },
    // ],
    // typescript
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "never",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        args: "after-used",
      },
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": true,
        "ts-nocheck": true,
        "ts-check": false,
        minimumDescriptionLength: 1,
      },
    ],
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-explicit-any": ["error"],

    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/method-signature-style": ["error", "property"],
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-floating-promises": "error",
  },
  overrides: [
    {
      files: ["**/lib/**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
