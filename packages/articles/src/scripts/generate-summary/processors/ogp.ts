import * as v from "valibot";
import ogs from "open-graph-scraper";
import { ExternalArticle } from "../../../core/types";
import { externalArticleSchema } from "../../../core/schema";

function extractDateFromUrl(url: string): Date | undefined {
  // Mobile Factory Tech Blog形式: /entry/YYYY/MM/DD/HHMMSS
  const mobileFactoryMatch = url.match(
    /\/entry\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{6})/
  );
  if (mobileFactoryMatch) {
    const [, year, month, day, time] = mobileFactoryMatch;
    if (time) {
      const hour = time.slice(0, 2);
      const minute = time.slice(2, 4);
      const second = time.slice(4, 6);
      return new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`
      );
    }
  }

  // エス・エム・エス テックブログ形式: /entry/YYYY/MM/DD/HHMMSS
  const smsMatch = url.match(/\/entry\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{6})/);
  if (smsMatch) {
    const [, year, month, day, time] = smsMatch;
    if (time) {
      const hour = time.slice(0, 2);
      const minute = time.slice(2, 4);
      const second = time.slice(4, 6);
      return new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`
      );
    }
  }

  return undefined;
}

export async function fetchArticleFromOGP(
  group: string,
  url: string,
  manualDate?: string
): Promise<ExternalArticle> {
  const { result } = await ogs({
    url,
    customMetaTags: [
      {
        multiple: false,
        property: "article:published_time",
        fieldName: "publishedTime",
      },
      {
        multiple: true,
        property: "article:tag",
        fieldName: "tags",
      },
    ],
  });

  if (result.error) throw new Error(result.error);
  const publishedTime = result.customMetaTags?.["publishedTime"];
  if (Array.isArray(publishedTime)) throw new Error("Un expected format");

  let date: Date | undefined;

  // 手動設定された日付を最優先で使用
  if (manualDate) {
    date = new Date(manualDate);
  } else if (publishedTime) {
    // 次にOGPから日付を取得を試みる
    date = new Date(publishedTime);
  } else {
    // OGPから取得できない場合、URLから日付を抽出を試みる
    date = extractDateFromUrl(url);
  }

  // どちらからも取得できない場合は現在日時を使用
  if (!date) {
    console.warn(
      `Could not extract date from URL or OGP for: ${url}. Using current date.`
    );
    date = new Date();
  }

  return v.parse(externalArticleSchema, {
    title: result.ogTitle,
    description: result.ogDescription,
    url,
    date: date.toISOString(),
    tags: [group].concat(result.customMetaTags?.["tags"] ?? []),
  });
}
