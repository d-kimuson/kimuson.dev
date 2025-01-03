import fs from 'fs-extra'
import { glob } from 'glob'
import { processMarkdownFile } from './processors/markdown'
import { copyAssets } from './processors/assets'
import { fetchExternalArticles } from './processors/zenn'
import type { Contents } from './types'

async function build(): Promise<void> {
  // 出力ディレクトリの準備
  await fs.ensureDir('dist')
  await fs.emptyDir('dist')
  await fs.ensureDir('dist/assets')

  // Markdownファイルの処理
  const markdownFiles = await glob('content/**/*.md')
  const internalArticles = await Promise.all(
    markdownFiles.map(processMarkdownFile)
  )

  // アセットのコピー
  await copyAssets()

  // 最終的なコンテンツの生成
  const contents: Contents = {
    internalArticles,
    externalArticles: {
      // 外部記事の取得
      zenn: await fetchExternalArticles('https://zenn.dev/kimuson/feed')
    }
  }

  // JSONファイルの出力
  await fs.writeJSON('dist/contents.json', contents, { spaces: 2 })
}

build().catch(error => {
  console.error('Build failed:', error)
  process.exit(1)
}) 