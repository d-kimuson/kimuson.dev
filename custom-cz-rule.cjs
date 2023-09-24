// @ts-check
const engine = require("cz-conventional-changelog/engine");

/** @typedef {{ title: string, description: string, emoji?: string } } CommitType */

// ref: https://github.com/pvdlg/conventional-commit-types/blob/master/index.js#L93
/** @type {{ [K: string]: CommitType }} */
const commitTypes = {
  "new-article": {
    description: "新しい記事の執筆",
    title: "New Article",
    emoji: "📖",
  },
  "fix-article": {
    description: "執筆済みの記事の修正",
    title: "Past Article",
    emoji: "📝",
  },
  feat: {
    description: "新しい機能の追加",
    title: "Features",
    emoji: "✨",
  },
  change: {
    description: "既存の機能を仕様変更",
    title: "Changes",
    emoji: "🔧",
  },
  fix: {
    description: "既存の機能のバグ修正",
    title: "Bug Fixes",
    emoji: "🐛",
  },
  docs: {
    description: "ドキュメント修正",
    title: "Documentation",
    emoji: "📚",
  },
  autofix: {
    description: "自動生成コードの再生性や、linterによる自動修正",
    title: "Autofix",
    emoji: "💎",
  },
  refactor: {
    description: "リファクタリング",
    title: "Code Refactoring",
    emoji: "📦",
  },
  test: {
    description: "テストの追加・修正",
    title: "Tests",
    emoji: "🚨",
  },
  ci: {
    description: "CI・CD に関する変更",
    title: "Continuous Integrations / Continuous Delivery",
    emoji: "⚙️",
  },
  chore: {
    description: "Other changes that don't modify src or test files",
    title: "Chores",
    emoji: "♻️",
  },
  revert: {
    description: "Reverts a previous commit",
    title: "Reverts",
    emoji: "🗑",
  },
};

module.exports = engine({
  types: commitTypes,
  // config

  defaultType: undefined,
  defaultScope: undefined,
  defaultSubject: undefined,
  defaultBody: undefined,
  defaultIssues: undefined,
  disableScopeLowerCase: undefined,
  disableSubjectLowerCase: undefined,
  maxHeaderWidth: 100,
  maxLineWidth: 100,
});
