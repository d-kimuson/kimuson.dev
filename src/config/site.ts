import { defineConfig } from "~/lib/define-config";

const SITE_NAME = "kimuson.dev";

export const siteConfig = defineConfig<{
  baseUrl: string;
  siteName: string;
}>({
  local: {
    baseUrl: "http://localhost:3000",
    siteName: SITE_NAME,
  },
  staging: {
    baseUrl: "FIXME",
    siteName: SITE_NAME,
  },
  production: {
    baseUrl: "https://kimuson.dev",
    siteName: SITE_NAME,
  },
});
