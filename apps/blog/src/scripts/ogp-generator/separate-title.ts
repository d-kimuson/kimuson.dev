import { loadDefaultJapaneseParser } from "budoux";

const MAX_CHARS_PER_LINE = 20;
const MAX_LINES = 6;

export const separateTitle = (title: string): string[] => {
  // BudouXを使って日本語文章を適切な位置で分割
  const parser = loadDefaultJapaneseParser();
  const segments = parser.parse(title);

  const lines: string[] = [];
  let currentLine = "";

  for (const segment of segments) {
    // 現在の行に新しいセグメントを追加しても30文字以内の場合
    if ((currentLine + segment).length <= MAX_CHARS_PER_LINE) {
      currentLine += segment;
    } else {
      // 30文字を超える場合、現在の行を確定して新しい行を開始
      if (currentLine) {
        lines.push(currentLine);
        currentLine = segment;
      } else {
        // currentLineが空の場合（segmentが30文字を超える場合）
        currentLine = segment;
      }
    }
  }

  // 最後の行を追加
  if (currentLine) {
    lines.push(currentLine);
  }

  // 行数制限の処理
  if (lines.length <= MAX_LINES) {
    return lines;
  }

  // 6行を超える場合、最初の5行を取り、残りを最後の行にまとめる
  const result = lines.slice(0, MAX_LINES - 1);
  const remainingLines = lines.slice(MAX_LINES - 1);
  const lastLine = remainingLines.join("");
  result.push(lastLine);

  return result;
};
