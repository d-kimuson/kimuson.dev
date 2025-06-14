/**
 * 記事のスラッグからOGP画像のパスを生成する
 */
export function getOgpImagePath(slug: string): string {
  // スラッグの先頭の "/" を除去
  const cleanSlug = slug.startsWith("/") ? slug.slice(1) : slug;
  return `/ogp/${cleanSlug}.png`;
}

/**
 * OGP画像が存在するかチェックする（開発用）
 */
export function checkOgpImageExists(_slug: string): boolean {
  // 本番では常にtrueを返す（画像は事前生成済み）
  // 開発時のみファイル存在チェックを行う場合はここで実装
  return true;
}
