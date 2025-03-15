'use client';
import { useState } from 'react';
import styles from './categories.list.module.scss';
import { medusa } from "@/lib/medusa";

export default function CategoriesList({ productCategories }: any) {

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: any[] }>({});

  const fetchProductsByCategory = async (categoryId: string) => {
    if (categoryProducts[categoryId]) return;
  
    const category = productCategories.find((category: { id: string }) => category.id === categoryId);
  
    if (!category) {
      return;
    }
  
    const fetchProductsForCategory = async (id: string) => {
      try {
        const { products } = await medusa.products.list({
          category_id: [id],
        });
        return products;
      } catch (error) {
        console.error("Error occured", id, error);
        return [];
      }
    };
  
    try {
      const products = await fetchProductsForCategory(categoryId);

      const updatedProducts: { [key: string]: any[] } = {
        [categoryId]: products,
      };
  
      for (const childCategory of category.category_children || []) {
        const childProducts = await fetchProductsForCategory(childCategory.id);
        updatedProducts[childCategory.id] = childProducts;
      }
  
      setCategoryProducts((prev) => ({
        ...prev,
        ...updatedProducts,
      }));
  
    } catch (error) {
      console.error("Ошибка при получении продуктов для категории", categoryId, error);
    }
  };
  

  const handleMouseEnter = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    fetchProductsByCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveCategoryId(null);
  };

  return (
    <ul className={styles.categoriesContainer}>
      {productCategories.map((category: any) => {
        if (!category.parent_category_id) {
          return (
            <li
              key={category.id}
              className={styles.categoryItem}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              {category.name}
              {activeCategoryId === category.id && (
                <ul className={styles.childCategories}>
                  {category.category_children.map((child: any) => (
                    <li key={child.id} className={styles.childCategoryItem}>
                      {child.name}
                      {categoryProducts[child.id] && (
                        <ul className={styles.productList}>
                          {categoryProducts[child.id].length > 0 ? (
                            categoryProducts[child.id].map((product) => (
                              <li key={product.id}>{product.title}</li>
                            ))
                          ) : (
                            <li>Нет товаров</li>
                          )}
                        </ul>
                      )}
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
