'use client';
import { useEffect, useState } from 'react';
import { useOverlay } from '@/context/OverlayContext';
import Link from 'next/link';
import styles from './categories.list.module.scss';
import { medusa } from "@/lib/medusa";
import { CategoryArrow } from '@/assets/icons/icons';

export default function CategoriesList({ productCategories, setShowOverlay }: any) {
  const { showOverlay, hideOverlay } = useOverlay();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: any[] }>({});
  
  const fetchProductsByCategory = async (categoryId: string) => {
    if (categoryProducts[categoryId]) return;
  
    const category = productCategories.find((category: { id: string }) => category.id === categoryId);
  
    if (!category) {
      return;
    }
  
    const fetchProducts = async (id: string) => {
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
      const products = await fetchProducts(categoryId);

      const updatedProducts: { [key: string]: any[] } = {
        [categoryId]: products,
      };
  
      for (const childCategory of category.category_children || []) {
        const childProducts = await fetchProducts(childCategory.id);
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
    showOverlay();
  };

  const handleMouseLeave = () => {
    setActiveCategoryId(null);
    hideOverlay();
  };

  return (
    <>
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
                <div className={styles.categoryItemWrapper}>
                  <div className={styles.categoryItemNameWrapper}>
                    {category.metadata?.picture && <img className={styles.categoryItemPicture} src={category.metadata.picture} alt="" />}
                    {category.name}
                  </div>
                  {category.category_children.length ? <CategoryArrow /> : null}
                </div>
                {activeCategoryId === category.id && category.category_children.length > 0 && (
                  <ul className={styles.childCategories}>
                    {category.category_children.map((child: any) => (
                      <li key={child.id} className={styles.childCategoryItem}>
                        <div className={styles.categoryItemNameWrapper}>
                          {child.metadata?.picture && <img className={styles.categoryItemPicture} src={child .metadata.picture} alt="" />}
                          {child.name}
                        </div>
                        {categoryProducts[child.id] && (
                          <ul className={styles.productList}>
                            {categoryProducts[child.id].length > 0 && (
                              categoryProducts[child.id].map((product) => (
                                <li className={styles.productListItem} key={product.id}>
                                  <Link href='/product' className={styles.productListLink}>
                                    {product.title}
                                  </Link>
                                </li>
                              ))
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
    </>
  );
}
