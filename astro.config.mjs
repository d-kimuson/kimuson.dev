import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import remarkCodeTitles from "remark-code-titles";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://kimuson.dev",
  integrations: [
    preact({
      compat: true,
    }),
    tailwind(),
    mdx(),
  ],
  server: {
    port: 4321,
  },
  markdown: {
    remarkPlugins: [remarkCodeTitles, "remark-gfm", "remark-smartypants"],
    extendDefaultPlugins: true,
    syntaxHighlight: "prism",
  },
});
