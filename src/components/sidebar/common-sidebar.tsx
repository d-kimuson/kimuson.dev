import React from 'react';
import { useStaticQuery, graphql } from "gatsby"

import { CommonSidebarQuery, MarkdownRemarkEdge } from "../../../types/graphql-types"
import CategoryList from '../category-list'
import TagList from '../tag-list'
import { filterDraft } from '../../utils/article'
import styles from './sidebar.module.scss';

const query = graphql`
  query CommonSidebar {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            category
            tags
            draft
          }
        }
      }
    }
  }
`

const CommonSidebar: React.FC = () => {
  const data: CommonSidebarQuery = useStaticQuery(query)
  const edges = data.allMarkdownRemark.edges
    .filter((e): e is MarkdownRemarkEdge => typeof e !== `undefined`)
    .filter(filterDraft)


  const categories = edges
    .map((e) => e.node.frontmatter?.category)
    .filter((c): c is string => typeof c !== `undefined`)
    
  const tags = Array.from(new Set(edges
    .flatMap((e) => e.node.frontmatter?.tags)
    .filter((c): c is string => typeof c !== `undefined`)))

  return (
    <>
      <section>
        <h1 className="m-section-title">CATEGORIES</h1>
        <CategoryList categories={categories} />
      </section>
      <section>
        <h1 className="m-section-title">TAGS</h1>
        <TagList tags={tags} isLink={true} />
      </section>
    </>
  )
};

export default CommonSidebar;
