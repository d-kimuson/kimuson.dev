import { createCanvas, registerFont, loadImage } from "canvas";
import { readFile } from "node:fs/promises";
import { imageSize } from "image-size";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// アセットファイルのパス
const ASSETS_DIR = path.join(__dirname, "../../../assets");
const BACKGROUND_IMAGE = path.join(ASSETS_DIR, "ogp_background.png");
const FONT_PATH = path.join(ASSETS_DIR, "fonts/BizinGothicNF-Regular.ttf");
const FONT_BOLD_PATH = path.join(ASSETS_DIR, "fonts/BizinGothicNF-Bold.ttf");

export const generateImage = async (
  lines: readonly string[]
): Promise<Buffer> => {
  // ベースとなる背景画像の読み込み
  const backgroundImage = await readFile(BACKGROUND_IMAGE);

  // font を登録
  registerFont(FONT_PATH, { family: "BizinGothicNF", weight: "normal" });
  registerFont(FONT_BOLD_PATH, { family: "BizinGothicNF", weight: "bold" });

  // canvas を作成
  const { width = 1200, height = 630 } = imageSize(backgroundImage) ?? {};
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 背景画像を描画
  ctx.drawImage(await loadImage(backgroundImage), 0, 0, width, height);

  // テキスト描画設定
  const maxWidth = width * 0.7; // 画面幅の75%
  const FONT_FAMILY = "BizinGothicNF";

  if (lines.length === 0 || lines.length > 6) {
    throw new Error(`Invalid lines: ${lines.length}`);
  }

  // 最適なフォントサイズを計算
  let fontSize = 150; // 初期フォントサイズ (より大きく設定)
  ctx.font = `bold ${fontSize}px ${FONT_FAMILY} bold`;

  // すべての行が maxWidth に収まるようにフォントサイズを調整
  while (true) {
    let longestLineWidth = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      if (metrics.width > longestLineWidth) {
        longestLineWidth = metrics.width;
      }
    }

    if (longestLineWidth <= maxWidth || fontSize <= 10) {
      // 最小フォントサイズを10pxとする
      break;
    }
    fontSize -= 1;
    ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
  }

  // テキスト描画
  ctx.fillStyle = "#fafafa"; // 白文字
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineSpacing = fontSize * 0.2; // 行間をフォントサイズの20%とする
  const totalTextHeight =
    lines.length * fontSize + (lines.length - 1) * lineSpacing;
  let currentY = (height - totalTextHeight) / 2 + fontSize / 2; // 最初の行のY座標 (垂直中央)
  const w = width / 2; // 水平中央

  for (const line of lines) {
    ctx.fillText(line, w, currentY, maxWidth);
    currentY += fontSize + lineSpacing;
  }

  return canvas.toBuffer("image/png");
};
