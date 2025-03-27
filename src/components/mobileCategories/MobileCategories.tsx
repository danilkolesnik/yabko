'use client';
import { useState, useEffect } from 'react';
import { medusa } from "@/lib/medusa";
import { CategoryArrow } from '@/assets/icons/icons';
import styles from './mobile.categories.module.scss';
import { NON_STANDARD_NODE_ENV } from 'next/dist/lib/constants';

export default function MobileCategories({ productCategories, isCategoriesOpen }: any) {

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: any[] }>({});

  const fetchProductsByCategory = async (categoryId: string) => {
    if (categoryProducts[categoryId]) return;
  
    const category = productCategories.find((cat: { id: string }) => cat.id === categoryId);
    if (!category) return;
  
    const fetchProducts = async (id: string) => {
      try {
        const { products } = await medusa.products.list({
          category_id: [id],
        });
        return products;
      } catch (error) {
        console.error("Error occurred", id, error);
        return [];
      }
    };
  
    try {
      const products = await fetchProducts(categoryId);
      const updatedProducts: { [key: string]: any[] } = {
        [categoryId]: products,
      };
  
      if (category.category_children?.length) {
        await Promise.all(
          category.category_children.map(async (childCategory: { id: string }) => {
            const childProducts = await fetchProducts(childCategory.id);
            updatedProducts[childCategory.id] = childProducts;
          })
        );
      }
  
      setCategoryProducts((prev) => ({
        ...prev,
        ...updatedProducts,
      }));
    } catch (error) {
      console.error("Error loading products for category", categoryId, error);
    }
  };
  

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
    fetchProductsByCategory(categoryId);
  };
  
  const renderCategory = (category: any) => {
    return (
      <li key={category.id} className={styles.categoryItem}>
        <div className={styles.categoryHeader} onClick={() => toggleCategory(category.id)}>
          <div className={styles.categoryItemNameWrapper}>
            {expandedCategories[category.id] && <span className={styles.arrowBackWrapper}><CategoryArrow /></span>}
            {category.metadata?.picture && <img src={category.metadata.picture} alt="" className={styles.categoryItemPicture} />}
            {category.name}
          </div>
          {category.category_children.length > 0 && !expandedCategories[category.id] && <CategoryArrow />}
        </div>
        {expandedCategories[category.id] && category.category_children.length > 0 && (
          <ul className={styles.subCategoryList}>
            {category.category_children.map((child: any) => {
              console.log('child id', child.id, 'cat', categoryProducts, '--> ', categoryProducts[child.id]);
              return (
                <li key={child.id} className={styles.subCategoryItem}>
                <div className={styles.subCategoryHeader} onClick={() => toggleCategory(child.id)}>
                  <div className={styles.categoryItemNameWrapper}>
                    {child.metadata?.picture && <img src={child.metadata.picture} alt="" className={styles.categoryItemPicture  } />}
                    {child.name}
                  </div>
                </div>
                {categoryProducts[child.id] && (
                  <ul className={styles.productList}>
                    {categoryProducts[child.id].map((product) => (
                      <li key={product.id} className={styles.productItem}>{product.title}</li>
                    ))}
                  </ul>
                )}
              </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className={`${styles.mobileMenuWrapper} ${isCategoriesOpen ? styles.open : ""}`}>
      <div className={styles.mobileMenuContent}>
        <ul className={styles.categoryList}>
          {productCategories.map((category: any) => {
            if (!category.parent_category_id) {
              return (
                <li key={category.id} className={styles.categoryItem}>
                  <div className={styles.categoryHeader} onClick={() => toggleCategory(category.id)}>
                    <div className={styles.categoryItemNameWrapper}>
                      {expandedCategories[category.id] && <span className={styles.arrowBackWrapper}><CategoryArrow /></span>}
                      {category.metadata?.picture && <img src={category.metadata.picture} alt="" className={styles.categoryItemPicture} />}
                      {category.name}
                    </div>
                    {category.category_children.length > 0 && !expandedCategories[category.id] && <CategoryArrow />}
                  </div>
                  {expandedCategories[category.id] && category.category_children.length > 0 && (
                    <ul className={styles.subCategoryList}>
                      {category.category_children.map((child: any) => {
                        console.log('child id', child.id, 'cat', categoryProducts, '--> ', categoryProducts[child.id]);
                        return (
                          <li key={child.id} className={styles.subCategoryItem}>
                          <div className={styles.subCategoryHeader} onClick={() => toggleCategory(child.id)}>
                            <div className={styles.categoryItemNameWrapper}>
                              {child.metadata?.picture && <img src={child.metadata.picture} alt="" className={styles.categoryItemPicture  } />}
                              {child.name}
                            </div>
                          </div>
                          {categoryProducts[child.id] && (
                            <ul className={styles.productList}>
                              {categoryProducts[child.id].map((product) => (
                                <li key={product.id} className={styles.productItem}>{product.title}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            } 
          })}
        </ul>
      </div>
    </div>
  );
}
