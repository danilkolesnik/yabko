'use client';
import { useState } from 'react';
import styles from './categories.list.module.scss';

export default function CategoriesList({ products, productCategories }: any) {
  // console.log(products);
  // console.log(productCategories);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    setActiveCategoryId(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveCategoryId(null);
  };

  return (
    <ul className={styles.categoriesContainer}>
      {productCategories.map((category : any) => {
        if (!category.parent_category_id) {
          return (
            <li
              key={category.id}
              className={styles.categoryItem}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              {category.name}
              {/* Отображаем дочерние категории при наведении */}
              {activeCategoryId === category.id && category.category_children.length > 0 && (
                <ul className={styles.childCategories}>
                  {category.category_children.map((child : any) => (
                    <li key={child.id} className={styles.childCategoryItem}>
                      {child.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
}
