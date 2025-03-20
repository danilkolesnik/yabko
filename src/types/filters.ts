
export interface ProductImage {
  id?: string;
  url: string;
}

export interface ProductPrice {
  id?: string;
  amount: number;
  currency_code: string;
}

export interface ProductVariant {
  id: string;
  title?: string;
  prices?: ProductPrice[];
  options?: any[];
  [key: string]: any;
}

export interface ProductOptionValue {
  id?: string;
  value: string;
}

export interface ProductOption {
  id?: string;
  title: string;
  values: (string | ProductOptionValue)[];
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
  category_children?: Category[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options?: ProductOption[];
  categories?: Category[]; // Категории продукта
}

export interface CatalogPageProps {
  category: Category; // Текущая категория
  products: Product[]; // Продукты для отображения
  breadcrumbs?: { name: string; path: string }[]; // Хлебные крошки
  allCategories?: Category[]; // Все доступные категории для фильтрации
}

export interface FilterOption {
  value: string;  // Значение фильтра (для категорий это ID)
  label: string;  // Отображаемое название
  count: number;  // Количество вариантов с этим значением
  normalized?: string; // Нормализованное значение для сопоставления (для атрибутов)
}

export interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
  expanded: boolean;
  // Для групп категорий:
  isCategory?: boolean; // Является ли группа категорией
  parentId?: string; // ID родительской категории (для подкатегорий)
  order?: number; // Порядок отображения
  isProduct?: boolean; // Новое свойство: является ли группа продуктами
}