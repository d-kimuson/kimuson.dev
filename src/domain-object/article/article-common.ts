export type ArticleCommon = {
  title: string;
  description?: string | undefined;
  fullUrl: string;
  siteName: "kimuson.dev" | "Mobile Factory Tech Blog" | "Zenn";
  thumbnail: string | undefined;
  date: Date;
};
