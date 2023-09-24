import { defineConfig } from "~/lib/define-config";

const SITE_NAME = "KIMUSON.DEV";

export const siteConfig = defineConfig<{
  baseUrl: string;
  siteName: string;
}>({
  local: {
    baseUrl: "http://localhost:4321",
    siteName: SITE_NAME,
  },
  production: {
    baseUrl: "https://kimuson.dev",
    siteName: SITE_NAME,
  },
});
