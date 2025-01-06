import fs from "fs-extra";
import { join, relative, dirname, resolve } from "node:path";
import { glob } from "glob";
import { configs } from "../../../core/configs";

export async function copyAssets(): Promise<void> {
  const assetFiles = await glob("content/**/*.{png,jpg,jpeg,gif,svg}");
  for (const file of assetFiles) {
    const targetPath = resolve(
      configs.outputDir,
      "assets",
      relative("content", file)
    );
    await fs.ensureDir(dirname(targetPath));
    await fs.copy(file, targetPath);
  }
}
