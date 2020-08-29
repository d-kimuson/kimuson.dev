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
