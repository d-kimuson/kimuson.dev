import { JSDOM } from "jsdom";
import sizeOf from "image-size";
import { ArticleDetail } from "../../../../../../packages/articles/src/core/types";

export type OgpImage = {
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
};

export type OGPData = {
  title: string;
  description?: string;
  siteName?: string;
  image?: OgpImage;
  url: string;
};

const getImageMeta = async (url: string): Promise<OgpImage> => {
  try {
    const imageResponse = await fetch(url);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const dimensions = sizeOf(buffer);

    if (!dimensions.width || !dimensions.height) {
      throw new Error("Failed to fetch image dimensions for " + url);
    }

    return {
      url,
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: dimensions.width / dimensions.height,
    };
  } catch (error) {
    console.error(`Failed to fetch image dimensions for ${url}:`, error);
    throw error;
  }
};

async function fetchOGP(url: string): Promise<OGPData | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const getMetaContent = (property: string): string | undefined => {
      const element = document.querySelector(
        `meta[property="${property}"], meta[name="${property}"]`
      );
      return element?.getAttribute("content") || undefined;
    };

    const title = getMetaContent("og:title") || document.title;
    if (!title) return null;

    const imageUrl = getMetaContent("og:image");

    return {
      title,
      description: getMetaContent("og:description"),
      siteName: getMetaContent("og:site_name"),
      image: imageUrl ? await getImageMeta(imageUrl) : undefined,
      url,
    };
  } catch (error) {
    console.error(`Failed to fetch OGP for ${url}:`, error);
    return null;
  }
}

const urlRegex = /https?:\/\/[^\s)>]+/g;
export const getOgpMap = async (article: ArticleDetail) => {
  // Extract all URLs from the markdown content
  const urls = Array.from(article.content.matchAll(urlRegex)).map(
    (match) => match[0]
  );

  // Fetch OGP data for all URLs
  const ogpDataEntries = await Promise.all(
    urls.map(async (url) => {
      const ogp = await fetchOGP(url);
      return ogp ? ([url, ogp] as const) : null;
    })
  );

  return Object.fromEntries(ogpDataEntries.filter((entry) => entry !== null));
};
