import sizeOf from "image-size";
import ogs from "open-graph-scraper";
import { ArticleDetail } from "@kimuson.dev/articles";

export type OgpImage = {
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
};

export type OGPData = {
  title: string;
  description?: string | undefined;
  siteName?: string | undefined;
  image?: OgpImage | undefined;
  url: string;
};

const getImageMeta = async (url: string): Promise<OgpImage | undefined> => {
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
  } catch {
    return undefined;
  }
};

async function fetchOGP(url: string): Promise<OGPData | null> {
  try {
    const ogp = await ogs({ url });
    if (ogp.error) {
      console.warn(ogp.error);
      return null;
    }

    const title = ogp.result.ogTitle;
    if (!title) return null;

    const imageUrl = (ogp.result.ogImage ?? []).at(0)?.url;

    return {
      title,
      description: ogp.result.ogDescription,
      siteName: ogp.result.ogSiteName,
      image: imageUrl ? await getImageMeta(imageUrl) : undefined,
      url,
    };
  } catch {
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
