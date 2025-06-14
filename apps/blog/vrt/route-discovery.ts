import { readdir, stat } from "fs/promises";
import { join } from "path";

export interface Route {
  path: string;
  url: string;
}

export async function discoverRoutes(outputDir: string): Promise<Route[]> {
  const routes: Route[] = [];

  async function scanDirectory(dir: string, basePath = ""): Promise<void> {
    const entries = await readdir(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // Skip internal Next.js directories
        if (entry.startsWith("_")) continue;

        const newBasePath = basePath ? `${basePath}/${entry}` : entry;
        await scanDirectory(fullPath, newBasePath);
      } else if (entry === "index.html") {
        const url = basePath ? `/${basePath}` : "/";
        routes.push({
          path: fullPath,
          url: url,
        });
      }
    }
  }

  await scanDirectory(outputDir);
  return routes;
}
