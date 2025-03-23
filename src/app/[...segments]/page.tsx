// src/app/[...segments]/page.tsx 
import React from "react";
import { Suspense } from "react";
import { medusa } from "@/lib/medusa";
import CatalogPage from "@/components/CatalogPage";
import styles from "./page.module.scss";

// Исправленная версия для работы с асинхронными параметрами
export default async function CatalogRoute(props: { params: { segments: string[] } }) {
  // Использование await с props.params перед доступом к segments
  const params = await props.params;
  
  // Теперь мы можем безопасно использовать params.segments
  if (!params.segments || params.segments.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h1>Категория не найдена</h1>
        <p>Запрошенная категория не существует или была удалена.</p>
      </div>
    );
  }
  
  try {
    // Получаем категорию по пути URL
    const category = await getCategoryByPath(params.segments);
    
    // Если категория не найдена, возвращаем страницу ошибки
    if (!category) {
      return (
        <div className={styles.errorContainer}>
          <h1>Категория не найдена</h1>
          <p>Запрошенная категория не существует или была удалена.</p>
        </div>
      );
    }
    
    // Получаем хлебные крошки
    const breadcrumbs = await getBreadcrumbs(params.segments);
    
    // Получаем продукты для данной категории
    const products = await getProductsByCategory(category.id);
    
    return (
      <div className={styles.pageContainer}>
        <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
          <CatalogPage 
            category={category} 
            products={products} 
            breadcrumbs={breadcrumbs}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Ошибка при отображении категории:", error);
    return (
      <div className={styles.errorContainer}>
        <h1>Произошла ошибка</h1>
        <p>Не удалось загрузить информацию о категории. Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }
}

// Функция для получения и построения хлебных крошек
async function getBreadcrumbs(segments: string[]) {
  if (!segments || segments.length === 0) {
    return [];
  }

  const breadcrumbs = [];
  let path = '';

  for (let i = 0; i < segments.length; i++) {
    path += `/${segments[i]}`;
    
    try {
      const { product_categories } = await medusa.productCategories.list({
        handle: segments[i],
      });
      
      if (product_categories && product_categories.length > 0) {
        breadcrumbs.push({
          name: product_categories[0].name,
          path: path,
        });
      } else {
        // Если категории нет, добавляем сегмент как текст
        breadcrumbs.push({
          name: segments[i].charAt(0).toUpperCase() + segments[i].slice(1),
          path: path,
        });
      }
    } catch (error) {
      console.error("Ошибка при получении данных для хлебных крошек:", error);
      breadcrumbs.push({
        name: segments[i].charAt(0).toUpperCase() + segments[i].slice(1),
        path: path,
      });
    }
  }

  return breadcrumbs;
}

// Функция для получения категории по пути URL
async function getCategoryByPath(path: string[]) {
  try {
    // Получаем последний сегмент пути
    const lastSegment = path[path.length - 1];
    
    // Ищем категорию по handle
    const { product_categories } = await medusa.productCategories.list({
      handle: lastSegment,
      include_descendants_tree: true, // Включаем дочерние категории
    });

    if (product_categories && product_categories.length > 0) {
      return product_categories[0];
    }

    return null;
  } catch (error) {
    console.error("Ошибка при получении категории:", error);
    return null;
  }
}

async function getProductsByCategory(categoryId: string) {
  try {
    const { products } = await medusa.products.list({
      category_id: [categoryId],
      limit: 100,
    });
    
    
    return products;
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    return [];
  }
}

