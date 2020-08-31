export interface HtmlAst {
  type: string;
  value?: string;
  tagName?: string;
  properties?: {
    id?: string;
    class?: string;
  };
  children: HtmlAst[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail: any;
  draft: boolean;
  category: string;
  tags: string[];
}
