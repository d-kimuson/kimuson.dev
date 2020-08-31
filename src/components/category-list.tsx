import React from 'react';

import Category from './category'
import styles from './category-list.module.scss';

interface CategoryListProps {
    categories: string[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }: CategoryListProps) => (
  <ul className={styles.categoryList}>
    {categories.map(category => (
      <li key={category}>
        <Category category={category} isLink={true}/>
      </li>
    ))}
  </ul>
);

export default CategoryList;
