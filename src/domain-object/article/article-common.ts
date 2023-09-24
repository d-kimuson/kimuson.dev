export type ArticleCommon = {
  title: string;
  description?: string | undefined;
  fullUrl: string;
  linkUrl: string;
  siteName: "kimuson.dev" | "Mobile Factory Tech Blog" | "Zenn";
  thumbnail: string | undefined;
  date: Date;
};
