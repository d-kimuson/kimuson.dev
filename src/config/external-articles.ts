import { JSDOM } from "jsdom";
import type { ExternalArticle } from "~/domain-object/article/external-article";
import { externalArticleSchema } from "~/domain-object/article/external-article";

export const externalArticles = [
  "https://tech.mobilefactory.jp/entry/2022/12/01/000000",
  "https://tech.mobilefactory.jp/entry/2022/01/17/103000",
  "https://tech.mobilefactory.jp/entry/2021/12/10/000000",
  "https://tech.mobilefactory.jp/entry/2021/12/02/000000",
  "https://tech.mobilefactory.jp/entry/2021/10/14/100000",
  "https://tech.mobilefactory.jp/entry/2023/05/15/163000",
  "https://tech.mobilefactory.jp/entry/2023/07/21/163000",
  "https://tech.mobilefactory.jp/entry/2023/09/06/160000",
] as const;

if (externalArticles.length !== Array.from(new Set(externalArticles)).length) {
  throw new Error("重複している externalArticles が存在します。");
}

const domToArticle = (dom: JSDOM): ExternalArticle => {
  const metaMapEntries = Array.from(
    dom.window.document.querySelectorAll("meta")
  ).flatMap((elm) => {
    if (!elm.hasAttribute("property")) return [];
    const prop = elm.getAttribute("property")?.trim();
    const content = elm.getAttribute("content");

    if (prop === undefined || content === null) return [];

    return [[prop, content] as const];
  });

  const metaMap: ReadonlyMap<string, string> = new Map(metaMapEntries);

  return externalArticleSchema.parse({
    title: metaMap.get("og:title"),
    siteName: metaMap.get("og:site_name"),
    url: metaMap.get("og:url"),
    image: metaMap.get("og:image"),
    description: metaMap.get("og:description"),
    date: metaMap.get("article:published_time"),
  });
};

export const fetchExternalArticles = ((): (() => Promise<
  ExternalArticle[]
>) => {
  let articles: ExternalArticle[] | undefined = undefined;

  return async () => {
    if (articles !== undefined) return articles;

    const domList = await Promise.all(
      externalArticles.map(async (url) => {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Bot",
          },
        });
        return new JSDOM(`${await res.text()}`);
      })
    );

    articles = domList.map(domToArticle);

    return articles;
  };
})();
