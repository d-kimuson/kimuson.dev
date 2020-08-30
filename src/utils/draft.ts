import { MarkdownRemarkEdge } from "../../types/graphql-types"

export const filterDraft = (e: MarkdownRemarkEdge): boolean => (
  process.env.NODE_ENV === `development` ||
    (typeof e.node.frontmatter?.draft === `boolean`
        && !e.node.frontmatter.draft
    )
)