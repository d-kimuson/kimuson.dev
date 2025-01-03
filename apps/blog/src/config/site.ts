import { object, string, url } from "valibot";
import { defineConfigWithSchema } from "~/lib/define-config";

const SITE_NAME = "KIMUSON.DEV";

const siteConfigSchema = object({
  baseUrl: string([url()]),
  siteName: string(),
});

export const siteConfig = defineConfigWithSchema(siteConfigSchema, {
  local: {
    baseUrl: "http://localhost:2828",
    siteName: SITE_NAME,
  },
  preview: {
    baseUrl: process.env["CF_PAGES_URL"],
    siteName: SITE_NAME,
  },
  production: {
    baseUrl: "https://kimuson.dev",
    siteName: SITE_NAME,
  },
});
