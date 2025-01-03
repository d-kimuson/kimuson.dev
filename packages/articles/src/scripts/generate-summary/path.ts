import path from 'node:path'

export function convertImagePath(imagePath: string, filePath: string): string {
  if (imagePath.startsWith('http')) return imagePath
  const absoluteImgPath = path.resolve(path.dirname(filePath), imagePath)
  const relativePath = path.relative(process.cwd(), absoluteImgPath)
  return `/assets/${relativePath}`
}

export function getSlugFromPath(filePath: string): string {
  return path.relative('content', filePath).replace(/\.md$/, '')
} 