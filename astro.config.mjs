import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
// import { defaultLayoutPlugin } from "./default-layout-plugin.mjs";
import remarkCodeTitles from "remark-code-titles";

export default defineConfig({
  site: "https://kimuson.dev",
  integrations: [
    preact({
      compat: true,
    }),
    tailwind(),
  ],
  markdown: {
    remarkPlugins: [
      // defaultLayoutPlugin,
      remarkCodeTitles,
      "remark-gfm",
      "remark-smartypants",
    ],
    extendDefaultPlugins: true,
    syntaxHighlight: "prism",
  },
});
