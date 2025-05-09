'use client';
import React, { useState, useEffect } from 'react';
import styles from './CatalogPage.module.scss';
import CatalogSlider from './catalogSlider/CatalogSlider';
import ProductCard from './productCard/ProductCard';
import { ReviewsIcon } from '@/assets/icons/icons';
import Link from 'next/link';
import { medusa } from "@/lib/medusa";
import { AccordeonIcon } from '@/assets/icons/icons';

// Базовые интерфейсы
interface ProductImage {
  id?: string;
  url: string;
}

interface ProductPrice {
  id?: string;
  amount: number;
  currency_code: string;
}

interface ProductVariant {
  id: string;
  title?: string;
  prices?: ProductPrice[];
  options?: any[]; // Массив опций варианта
  [key: string]: any;
}

interface ProductOptionValue {
  id?: string;
  value: string;
}

interface ProductOption {
  id?: string;
  title: string;
  values: (string | ProductOptionValue)[];
}

interface Category {
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
  categories?: Category[]; // Категории  та
}

interface CatalogPageProps {
  category: Category; // Текущая категория
  products: Product[]; // Продукты для отображения
  breadcrumbs?: { name: string; path: string }[]; // Хлебные крошки
  allCategories?: Category[]; // Все доступные категории для фильтрации
}

// Интерфейсы для динамических фильтров
interface FilterOption {
  value: string;  // Значение фильтра (для категорий это ID)
  label: string;  // Отображаемое название
  count: number;  // Количество вариантов с этим значением
  normalized?: string; // Нормализованное значение для сопоставления (для атрибутов)
}

interface FilterGroup {
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

// Функция для получения значения опции из варианта
const getVariantOptionValue = (variant: ProductVariant, optionName: string): string | undefined => {
  const lowerOptionName = optionName.toLowerCase();
  
  // 1. Сначала проверяем прямые свойства варианта
  for (const key in variant) {
    if (key.toLowerCase() === lowerOptionName && variant[key] !== undefined) {
      return String(variant[key]);
    }
  }
  
  // 2. Проверяем поля title и option.title в варианте 
  if (variant.title && typeof variant.title === 'string') {
    // const titleParts = variant.title.split(' / ');
    // if (optionName.toLowerCase() === 'color' && titleParts.length > 0) {
    //   return titleParts[0]; // Обычно первая часть - цвет
    // }
    // if (optionName.toLowerCase() === 'storage' && titleParts.length > 1) {
    //   return titleParts[1]; // Обычно вторая часть - хранилище
    // }
  }
  
  // 3. Проверяем массив options, если он есть
  if (variant.options && Array.isArray(variant.options)) {
    // Ищем опцию с нужным названием
    for (const optItem of variant.options) {
      // 3.1 Проверяем наличие вложенного объекта option с полем title (стандартная структура)
      if (optItem.option && optItem.option.title && 
          optItem.option.title.toLowerCase() === lowerOptionName && 
          optItem.value !== undefined) {
        return optItem.value;
      }
      
      if (optItem[lowerOptionName] !== undefined) {
        console.log("OptItem[lowerOptionName]: ")
        return String(optItem[lowerOptionName]);
      }
    }
  }
  
  // 4. Не нашли значение
  return undefined;
};

// Функция для нормализации значения опции
const normalizeOptionValue = (optionName: string, value: string): string => {
  // if (!value) return '';
  
  // const lowerValue = value.toLowerCase();
  
  // // Нормализация для storage
  // if (optionName.toLowerCase() === 'storage') {
  //   // Убираем пробелы и приводим к единому формату
  //   let normalized = lowerValue.replace(/\s+/g, '');
    
  //   // Преобразуем все обозначения гигабайт/терабайт к единому формату
  //   normalized = normalized
  //     .replace(/gb/i, 'GB')
  //     .replace(/tb/i, 'TB')
  //     .replace(/mb/i, 'MB');
    
  //   return normalized;
  // }
  
  // // Нормализация для размеров
  // if (optionName.toLowerCase() === 'size') {
  //   return value.toUpperCase();
  // }
  
  // // Нормализация для цветов
  // if (optionName.toLowerCase() === 'color') {
  //   // Первая буква заглавная, остальные строчные
  //   return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  // }
  
  // Для других опций возвращаем как есть
  return value;
};

// Функция для получения отображаемого значения опции
const getDisplayOptionValue = (optionName: string, value: string): string => {
  // if (!value) return '';
  
  // // Отображение для storage
  // if (optionName.toLowerCase() === 'storage') {
  //   // Проверяем наличие обозначений гигабайт/терабайт
  //   if (value.toUpperCase().includes('GB')) {
  //     // Форматируем, например, "256GB"
  //     return value.toUpperCase();
  //   }
  //   if (value.toUpperCase().includes('TB')) {
  //     // Форматируем, например, "1TB"
  //     return value.toUpperCase();
  //   }
    
  //   // Если нет обозначения, предполагаем гигабайты
  //   if (/^\d+$/.test(value)) {
  //     return `${value}GB`;
  //   }
    
  //   return value;
  // }
  
  return value;
};

// Функция для создания групп фильтров без дублирования
const createUniqueFilterGroups = (variants: {product: Product, variant: ProductVariant}[]): FilterGroup[] => {
  console.log("===== СОЗДАНИЕ УНИКАЛЬНЫХ ФИЛЬТРОВ =====");
  
  // Шаг 1: Собираем все опции из всех продуктов и их значения в единую структуру
  const filterOptions: Record<string, {
    displayName: string,
    values: Map<string, {
      originalValue: string,
      count: number
    }>
  }> = {};
  
  // Получаем уникальные продукты
  const uniqueProducts = new Map<string, Product>();
  variants.forEach(({ product }) => {
    if (!uniqueProducts.has(product.id)) {
      uniqueProducts.set(product.id, product);
    }
  });
  
  console.log(`Найдено ${uniqueProducts.size} уникальных продуктов`);
  
  // Извлекаем все опции из продуктов и их значения
  uniqueProducts.forEach(product => {
    console.log(`Обработка товара: "${product.title}" (id: ${product.id})`);
    
    if (!product.options || !Array.isArray(product.options)) {
      console.log("  У товара нет опций");
      return;
    }
    
    product.options.forEach(option => {
      if (!option.title) return;
      
      const optionName = option.title;
      const normalizedName = optionName.toLowerCase(); // Ключ для группировки
      
      console.log(`  Опция: "${optionName}"`);
      
      // Создаем запись для опции, если её ещё нет
      if (!filterOptions[normalizedName]) {
        filterOptions[normalizedName] = {
          displayName: optionName,
          values: new Map()
        };
      }
      
      // Добавляем все значения опции
      option.values.forEach(value => {
        let valueStr: string;
        
        if (typeof value === 'string') {
          valueStr = value;
        } else if (value && typeof value.value === 'string') {
          valueStr = value.value;
        } else {
          return; // Пропускаем некорректные значения
        }
        
        console.log(`    Значение: "${valueStr}"`);
        
        // Нормализуем значение для группировки
        const normalizedValue = normalizeOptionValue(optionName, valueStr);
        
        // Инициализируем запись для значения, если её ещё нет
        if (!filterOptions[normalizedName].values.has(normalizedValue)) {
          filterOptions[normalizedName].values.set(normalizedValue, {
            originalValue: valueStr,
            count: 0
          });
        }
      });
    });
  });
  
  // Шаг 2: Подсчитываем количество вариантов для каждого значения
  console.log("\nПодсчет вариантов:");
  
  variants.forEach(({ product, variant }) => {
    // Для каждой опции
    Object.entries(filterOptions).forEach(([normalizedName, optionInfo]) => {
      // Получаем значение опции из варианта
      const variantValue = getVariantOptionValue(variant, optionInfo.displayName);
      
      if (variantValue) {
        console.log(`Найдено значение "${variantValue}" для опции "${optionInfo.displayName}" в варианте ${variant.id} (товар: ${product.title})`);
        
        // Нормализуем значение для сопоставления
        const normalizedValue = normalizeOptionValue(optionInfo.displayName, variantValue);
        
        // Увеличиваем счетчик, если такое значение есть
        if (optionInfo.values.has(normalizedValue)) {
          const valueInfo = optionInfo.values.get(normalizedValue)!;
          valueInfo.count++;
        } else {
          // Если значения нет, добавляем его
          console.log(`  Новое значение "${variantValue}" (нормализовано: "${normalizedValue}") для опции "${optionInfo.displayName}"`);
          optionInfo.values.set(normalizedValue, {
            originalValue: variantValue,
            count: 1
          });
        }
      }
    });
  });
  
  // Шаг 3: Создаем финальные группы фильтров
  console.log("\nСоздание финальных групп фильтров:");
  
  const filterGroups: FilterGroup[] = [
    // Добавляем фильтр по цене
    {
      id: 'price',
      name: 'Ціна',
      options: [],
      expanded: true
    }
  ];
  
  // Добавляем остальные фильтры
  Object.entries(filterOptions).forEach(([normalizedName, optionInfo]) => {
    // Создаем опции для этого фильтра
    const options: FilterOption[] = [];
    
    optionInfo.values.forEach((valueInfo, normalizedValue) => {
      if (valueInfo.count > 0) { // Добавляем только значения с товарами
        options.push({
          value: valueInfo.originalValue,
          label: getDisplayOptionValue(optionInfo.displayName, valueInfo.originalValue),
          count: valueInfo.count,
          normalized: normalizedValue
        });
      }
    });
    
    // Пропускаем пустые группы
    if (options.length === 0) {
      console.log(`  Пустая группа "${optionInfo.displayName}" пропущена`);
      return;
    }
    
    // Сортируем опции
    // options.sort((a, b) => {
    //   // Для storage - специальная сортировка по размеру
    //   if (normalizedName === 'storage') {
    //     const getNumericValue = (str: string) => {
    //       const match = str.match(/(\d+)/);
    //       if (match) {
    //         let value = parseInt(match[1], 10);
    //         if (str.toUpperCase().includes('TB')) {
    //           value *= 1024;
    //         }
    //         return value;
    //       }
    //       return 0;
    //     };
        
    //     return getNumericValue(a.value) - getNumericValue(b.value);
    //   }
      
    //   // Для других опций - по алфавиту
    //   return a.label.localeCompare(b.label);
    // });
    
    // Добавляем группу в результат
    filterGroups.push({
      id: normalizedName, // Используем нормализованное имя как ID!
      name: optionInfo.displayName,
      options: options,
      expanded: true
    });
    
    console.log(`  Создана группа "${optionInfo.displayName}" (id: ${normalizedName}) с ${options.length} опциями:`);
    options.forEach(opt => console.log(`    - ${opt.label} (${opt.count})`));
  });
  
  return filterGroups;
};

export default function CatalogPage({ 
  category, 
  products = [], 
  breadcrumbs = [],
  allCategories = []
}: CatalogPageProps) {
  // Состояние для отображения/скрытия панели фильтров
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Все варианты для отслеживания
  const [allVariants, setAllVariants] = useState<{product: Product, variant: ProductVariant}[]>([]);
  // Отфильтрованные варианты
  const [filteredVariants, setFilteredVariants] = useState<{product: Product, variant: ProductVariant}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ценовой диапазон
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 100000]);
  
  // Динамические фильтры для атрибутов продуктов
  const [attributeFilterGroups, setAttributeFilterGroups] = useState<FilterGroup[]>([]);
  
  // Фильтры категорий для иерархического отображения
  const [categoryFilterGroups, setCategoryFilterGroups] = useState<FilterGroup[]>([]);
  
  // Новый фильтр по продуктам
  const [productFilterGroup, setProductFilterGroup] = useState<FilterGroup | null>(null);
  
  // Выбранные фильтры
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  
  // Переключение панели фильтров
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  
  // НОВОЕ: Подготовка иерархии категорий для фильтрации
  useEffect(() => {
    if (allCategories.length === 0) return;
    
    console.log("Подготовка иерархии категорий для фильтрации");
    
    // Шаг 1: Организуем категории по уровням иерархии
    const rootCategories = allCategories.filter(cat => !cat.parent_category_id);
    
    // Получаем подсчет продуктов для каждой категории
    const categoryCounts: Record<string, number> = {};
    
    products.forEach(product => {
      if (!product.categories) return;
      
      product.categories.forEach(cat => {
        categoryCounts[cat.id] = (categoryCounts[cat.id] || 0) + 1;
      });
    });
    
    // Шаг 2: Создаем группы фильтров для категорий
    const categoryGroups: FilterGroup[] = [];
    
    // Добавляем корневые категории как основные группы
    rootCategories.forEach((rootCat, index) => {
      // Создаем группу для корневой категории, если она не является текущей
      if (rootCat.id !== category.id) {
        categoryGroups.push({
          id: `category_${rootCat.id}`,
          name: rootCat.name,
          options: [{
            value: rootCat.id,
            label: rootCat.name,
            count: categoryCounts[rootCat.id] || 0
          }],
          expanded: true,
          isCategory: true,
          order: index
        });
      }
      
      // Находим все подкатегории этой корневой категории
      const childCategories = allCategories.filter(cat => cat.parent_category_id === rootCat.id);
      
      if (childCategories.length > 0) {
        // Создаем отдельную группу для подкатегорий
        categoryGroups.push({
          id: `subcategories_${rootCat.id}`,
          name: `Модель ${rootCat.name}:`,
          options: childCategories.map(child => ({
            value: child.id,
            label: child.name,
            count: categoryCounts[child.id] || 0
          })),
          expanded: true,
          isCategory: true,
          parentId: rootCat.id,
          order: index + 100 // Чтобы подкатегории отображались после соответствующих родительских
        });
      }
    });
    
    // Сортируем группы по порядку
    categoryGroups.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Отфильтровываем пустые группы подкатегорий
    const filteredGroups = categoryGroups.filter(group => 
      group.options.length > 0 && group.options.some(opt => opt.count > 0)
    );
    
    console.log(`Создано ${filteredGroups.length} групп категорий для фильтрации`);
    setCategoryFilterGroups(filteredGroups);
    
    // Инициализируем выбранные фильтры для категорий
    const initialCategoryFilters: Record<string, string[]> = {};
    filteredGroups.forEach(group => {
      initialCategoryFilters[group.id] = [];
    });
    setSelectedFilters(prev => ({...prev, ...initialCategoryFilters}));
    
  }, [allCategories, products, category.id]);
  
  useEffect(() => {
    // Prevent body scrolling when filter panel is open
    if (isFilterPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterPanelOpen]);
  
  // Первоначальная инициализация данных
  useEffect(() => {
    if (products.length > 0) {
      console.log("Инициализация с", products.length, "товарами");
      
      // Собираем все варианты всех продуктов
      const variants = products.flatMap(product => 
        (product.variants || []).map(variant => ({ product, variant }))
      );
      
      // Выводим структуру первого варианта для отладки
      if (variants.length > 0) {
        console.log("Структура первого варианта:", variants[0].variant);
      }
      
      // Сохраняем все варианты для дальнейшего использования
      setAllVariants(variants);
      
      // Изначально показываем все варианты
      setFilteredVariants(variants);
      
      // Извлекаем цены
      extractPriceRange(variants);
      
      // ВАЖНО: Вместо extractFilterOptions и mergeFilterGroups
      // используем нашу новую функцию createUniqueFilterGroups
      const uniqueFilterGroups = createUniqueFilterGroups(variants);
      
      // НОВОЕ: Создаем фильтр по продуктам
      const productFilter: FilterGroup = {
        id: 'products',
        name: 'Продукти',
        options: products.map(product => ({
          value: product.id,
          label: product.title,
          count: product.variants.length
        })),
        expanded: true,
        isProduct: true
      };
      
      setProductFilterGroup(productFilter);
      
      // ОТЛАДКА: Анализ созданных групп фильтров 
      console.log("\n===== ИТОГОВЫЕ ГРУППЫ ФИЛЬТРОВ =====");
      uniqueFilterGroups.forEach(group => {
        console.log(`Фильтр: id="${group.id}", name="${group.name}", опций=${group.options.length}`);
        console.log(`  Значения: ${group.options.map(o => `"${o.label}" (${o.count})`).join(', ')}`);
      });
      
      // Устанавливаем группы фильтров атрибутов
      setAttributeFilterGroups(uniqueFilterGroups);
      
      // Инициализируем выбранные фильтры атрибутов и продуктов
      const initialFilters: Record<string, string[]> = {};
      uniqueFilterGroups.forEach(group => {
        initialFilters[group.id] = [];
      });
      initialFilters['products'] = []; // Добавляем инициализацию для фильтра по продуктам
      
      setSelectedFilters(prev => ({...prev, ...initialFilters}));
      
      setLoading(false);
    }
  }, [products]);
  
  // Извлечение ценового диапазона
  const extractPriceRange = (variants: {product: Product, variant: ProductVariant}[]) => {
    try {
      const prices: number[] = [];
      
      variants.forEach(({ variant }) => {
        // ИЗМЕНЕНО: Используем variant.metadata.price вместо variant.prices
        if (variant.metadata && typeof variant.metadata.price === 'number') {
          prices.push(variant.metadata.price);
        }
      });
      
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        console.log(`Установка ценового диапазона: ${minPrice} - ${maxPrice}`);
        setPriceRange([minPrice, maxPrice]);
        setCurrentPriceRange([minPrice, maxPrice]);
      }
    } catch (error) {
      console.error("Ошибка при извлечении ценового диапазона:", error);
    }
  };
  
  // Обработчик изменения чекбокса фильтра
  const handleFilterChange = (groupId: string, value: string) => {
    console.log(`Изменение фильтра: ${groupId} = ${value}`);
    
    setSelectedFilters(prev => {
      const groupValues = [...(prev[groupId] || [])];
      
      if (groupValues.includes(value)) {
        // Удаляем значение, если оно уже выбрано
        console.log(`Удаляем значение "${value}" из группы "${groupId}"`);
        return {
          ...prev,
          [groupId]: groupValues.filter(v => v !== value)
        };
      } else {
        // Добавляем новое значение
        console.log(`Добавляем значение "${value}" в группу "${groupId}"`);
        return {
          ...prev,
          [groupId]: [...groupValues, value]
        };
      }
    });
  };
  
  // Применение фильтров при изменении выбранных фильтров или ценового диапазона
  useEffect(() => {
    if (allVariants.length === 0) return;
    
    console.log("=== ПРИМЕНЕНИЕ ФИЛЬТРОВ ===");
    const categoryFilters = Object.entries(selectedFilters)
      .filter(([groupId, values]) => groupId.startsWith('category_') || groupId.startsWith('subcategories_'));
    
    const attributeFilters = Object.entries(selectedFilters)
      .filter(([groupId, values]) => !groupId.startsWith('category_') && !groupId.startsWith('subcategories_') && groupId !== 'price' && groupId !== 'products' && values.length > 0);
    
    // НОВОЕ: Получаем выбранные продукты
    const productFilter = selectedFilters['products'] || [];
    
    console.log("Фильтры по категориям:", categoryFilters);
    console.log("Фильтры по атрибутам:", attributeFilters);
    console.log("Фильтры по продуктам:", productFilter);
    console.log(`Ценовой диапазон: ${currentPriceRange[0]} - ${currentPriceRange[1]}`);
    
    setLoading(true);
    
    try {
      // ЭТАП 1: Начинаем с полного набора вариантов
      console.log(`Шаг 1: Начинаем с ${allVariants.length} вариантов`);
      let filtered = [...allVariants];
      
      // ЭТАП 2: Фильтр по цене
      console.log("Шаг 2: Применяем фильтр по цене");
      const beforePriceFilter = filtered.length;
      
      filtered = filtered.filter(({ variant }) => {
        // ИЗМЕНЕНО: Используем variant.metadata.price вместо variant.prices
        if (!variant.metadata || typeof variant.metadata.price !== 'number') {
          return true; // Если нет цены, пропускаем этот фильтр
        }
        
        const priceValue = variant.metadata.price;
        return priceValue >= currentPriceRange[0] && priceValue <= currentPriceRange[1];
      });
      
      console.log(`После фильтра по цене: ${filtered.length} вариантов (убрано ${beforePriceFilter - filtered.length})`);
      
      // ЭТАП 3: Фильтр по категориям
      if (categoryFilters.length > 0 && categoryFilters.some(([_, values]) => values.length > 0)) {
        console.log("Шаг 3: Применяем фильтр по категориям");
        const beforeCategoryFilter = filtered.length;
        
        // Собираем все выбранные ID категорий из разных групп
        const selectedCategoryIds = categoryFilters
          .filter(([_, values]) => values.length > 0)
          .flatMap(([_, values]) => values);
        
        if (selectedCategoryIds.length > 0) {
          filtered = filtered.filter(({ product }) => {
            // Проверяем, есть ли у продукта категории
            if (!product.categories || product.categories.length === 0) {
              return false;
            }
            
            // Продукт проходит фильтр, если хотя бы одна из его категорий выбрана
            return product.categories.some(cat => selectedCategoryIds.includes(cat.id));
          });
          
          console.log(`После фильтра по категориям: ${filtered.length} вариантов (убрано ${beforeCategoryFilter - filtered.length})`);
        }
      }
      
      // ЭТАП 4: Фильтр по атрибутам продукта
      if (attributeFilters.length > 0) {
        console.log("Шаг 4: Применяем фильтр по атрибутам продукта");
        console.log(`Активные фильтры: ${attributeFilters.map(([id, values]) => `${id}: ${values.join(', ')}`).join('; ')}`);
        
        const beforeAttributesFilter = filtered.length;
        
        filtered = filtered.filter(({ product, variant }) => {
          // Проверяем соответствие каждому активному фильтру
          return attributeFilters.every(([groupId, values]) => {
            // Находим фильтр с таким ID
            const filterGroup = attributeFilterGroups.find(group => group.id === groupId);
            if (!filterGroup) return true;
            
            // Получаем значение опции для этого варианта
            const variantValue = getVariantOptionValue(variant, filterGroup.name);
            
            // Если нет выбранных значений для этой опции, пропускаем проверку
            if (values.length === 0) return true;
            
            // Если у варианта нет значения опции, не соответствует
            if (!variantValue) {
              console.log(`Вариант ${variant.id} (товар: ${product.title}) не имеет значения для опции "${filterGroup.name}"`);
              return false;
            }
            
            // Нормализуем значение варианта для сравнения
            const normalizedVariantValue = normalizeOptionValue(filterGroup.name, variantValue);
            
            // Проверяем, входит ли значение в список выбранных
            const matches = values.some(value => {
              const normalizedValue = normalizeOptionValue(filterGroup.name, value);
              return normalizedVariantValue === normalizedValue;
            });
            
            if (matches) {
              console.log(`Вариант ${variant.id} (товар: ${product.title}) прошел фильтр "${filterGroup.name}": ${variantValue}`);
            } else {
              console.log(`Вариант ${variant.id} (товар: ${product.title}) НЕ прошел фильтр "${filterGroup.name}": ${variantValue} не входит в [${values.join(', ')}]`);
            }
            
            return matches;
          });
        });
        
        console.log(`После фильтра по атрибутам: ${filtered.length} вариантов (убрано ${beforeAttributesFilter - filtered.length})`);
      }
      
      // НОВОЕ: ЭТАП 5: Фильтр по конкретным продуктам
      if (productFilter.length > 0) {
        console.log("Шаг 5: Применяем фильтр по продуктам");
        const beforeProductFilter = filtered.length;
        
        filtered = filtered.filter(({ product }) => {
          const matches = productFilter.includes(product.id);
          if (matches) {
            console.log(`Товар "${product.title}" (id: ${product.id}) прошел фильтр по продуктам`);
          } else {
            console.log(`Товар "${product.title}" (id: ${product.id}) НЕ прошел фильтр по продуктам`);
          }
          return matches;
        });
        
        console.log(`После фильтра по продуктам: ${filtered.length} вариантов (убрано ${beforeProductFilter - filtered.length})`);
      }
      
      console.log(`ИТОГ: Отфильтровано ${filtered.length} из ${allVariants.length} вариантов`);
      setFilteredVariants(filtered);
    } catch (error) {
      console.error("Ошибка при применении фильтров:", error);
      // В случае ошибки показываем все варианты
      setFilteredVariants(allVariants);
    } finally {
      setLoading(false);
    }
  }, [allVariants, currentPriceRange, selectedFilters, attributeFilterGroups]);
  
  // Переключение развернутости фильтра
  const toggleFilterGroup = (groupId: string) => {
    // Проверяем, к какому типу фильтров относится группа
    if (groupId === 'price' || attributeFilterGroups.some(g => g.id === groupId)) {
      setAttributeFilterGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId ? { ...group, expanded: !group.expanded } : group
        )
      );
    } else if (groupId === 'products' && productFilterGroup) {
      setProductFilterGroup(prev => prev ? { ...prev, expanded: !prev.expanded } : null);
    } else {
      setCategoryFilterGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId ? { ...group, expanded: !group.expanded } : group
        )
      );
    }
  };
  
  // Обработчик изменения ценового диапазона
  const handlePriceRangeChange = (min: number, max: number) => {
    setCurrentPriceRange([min, max]);
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    console.log("=== СБРОС ВСЕХ ФИЛЬТРОВ ===");
    
    // Сбрасываем все выбранные фильтры
    const resetSelections: Record<string, string[]> = {};
    
    // Сбрасываем фильтры атрибутов
    attributeFilterGroups.forEach(group => {
      resetSelections[group.id] = [];
    });
    
    // Сбрасываем фильтры категорий
    categoryFilterGroups.forEach(group => {
      resetSelections[group.id] = [];
    });
    
    // Сбрасываем фильтр по продуктам
    resetSelections['products'] = [];
    
    setSelectedFilters(resetSelections);
    
    // Сбрасываем ценовой диапазон
    setCurrentPriceRange(priceRange);
  };
  
  // Функция для определения цвета по названию
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'graphite': '#333333',
      'gray': '#808080',
      'space gray': '#676767',
      'midnight': '#121212',
      'starlight': '#F9F3EE',
      'product red': '#FF0000',
      'black titanium': '#333333',
      'white titanium': '#F5F5F5',
      'natural titanium': '#D6CFC7',
      'desert titanium': '#E8D6C2',
    };
    
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };
  
  // Если продуктов нет
  if (products.length === 0) {
    return (
      <div className={styles.catalogContainer}>
        <h1 className={styles.categoryTitle}>{category?.name || 'Категория'}</h1>
        <div className={styles.noResults}>В данной категории нет товаров</div>
      </div>
    );
  }

  const [sliderProducts, setSliderProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any>([]);
  
  const fetchProductsByCategories = async (filteredCategories: any[]) => {
      const updatedProducts: { [key: string]: any[] } = {};
      
      const fetchProducts = async (categoryId: string) => {
        try {
          const { products } = await medusa.products.list({
            category_id: [categoryId],
          });
          return products;
        } catch (error) {
          console.error("Ошибка при получении продуктов для категории", categoryId, error);
          return [];
        }
      };
    
      for (const category of filteredCategories) {
        const categoryId = category.id;
        
        try {
          const products = await fetchProducts(categoryId);
          
          updatedProducts[categoryId] = products;
    
          for (const childCategory of category.category_children || []) {
            const childProducts = await fetchProducts(childCategory.id);
            updatedProducts[childCategory.id] = childProducts;
          }
          
        } catch (error) {
          console.error("Ошибка при обработке категории", categoryId, error);
        }
      }
      setCategoryProducts(updatedProducts);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [{ products }, { product_categories }] = await Promise.all([
            medusa.products.list(),
            medusa.productCategories.list(),
          ]);
          setSliderProducts(products);
  
          const filteredCategories = product_categories.filter((category: any) => {
            return category.metadata?.slider === true;
          });
  
          fetchProductsByCategories(filteredCategories);
  
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
      fetchData();
    }, []);

  return (
    <div className={styles.catalogContainer}>
      
      {category && categoryProducts && <CatalogSlider key={category.id} category={category} categoryProducts={categoryProducts} />}
      
      {/* Хлебные крошки */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className={styles.breadcrumbSeparator}>/</span>
              <Link href={crumb.path}>{crumb.name}</Link>
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Заголовок категории */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.categoryTitle}>{category?.name || 'Категория'}</h1>
        <div className={styles.reviewStars}>★★★★★ <ReviewsIcon /></div>
      </div>
      
      {/* Кнопка для отображения фильтров */}
      <button 
        className={styles.filterButton} 
        onClick={toggleFilterPanel}
      >
        <span className={styles.filterIcon}></span>
        Фільтр (5)
      </button>
      
      {/* Панель фильтров, которая выезжает сверху */}
      <div className={`${styles.filterPanel} ${isFilterPanelOpen ? styles.filterPanelOpen : ''}`}>
        <div className={styles.filterPanelHeader}>
          <h2>Фільтри</h2>
          <button className={styles.closeButton} onClick={toggleFilterPanel}>
            ✕
          </button>
        </div>
        
        <div className={styles.filterPanelContent}>
          {/* Фильтр по цене */}
          <div className={styles.filterGroup}>
            <div 
              className={styles.filterHeader} 
              onClick={() => toggleFilterGroup('price')}
            >
              <h3>Ціна</h3>
              <span className={`${styles.collapseIcon} ${attributeFilterGroups[0]?.expanded ? '' : styles.rotatedIcon}`}>
                <AccordeonIcon />
              </span>
            </div>
            
            <div className={`${styles.filterContent} ${attributeFilterGroups[0]?.expanded ? styles.expanded : ''}`}>
              <div className={styles.priceRange}>
                <div className={styles.rangeValues}>
                  <span>{currentPriceRange[0]}</span>
                  <span>{currentPriceRange[1]}</span>
                </div>
                <div className={styles.rangeSliders}>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={currentPriceRange[1]}
                    onChange={(e) => handlePriceRangeChange(currentPriceRange[0], Number(e.target.value))}
                    className={styles.rangeSlider}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* НОВОЕ: Фильтр по продуктам */}
          {productFilterGroup && (
            <div className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup('products')}
              >
                <h3>{productFilterGroup.name}</h3>
                <span className={`${styles.collapseIcon} ${productFilterGroup.expanded ? '' : styles.rotatedIcon}`}>
                  <AccordeonIcon />
                </span>
              </div>
              
              <div className={`${styles.filterContent} ${productFilterGroup.expanded ? styles.expanded : ''}`}>
                <div className={styles.filterOptions}>
                  {productFilterGroup.options.map((option) => (
                    <div key={`products-${option.value}`} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        id={`products-mobile-${option.value}`}
                        checked={selectedFilters['products']?.includes(option.value) || false}
                        onChange={() => handleFilterChange('products', option.value)}
                      />
                      <label htmlFor={`products-mobile-${option.value}`}>
                        {option.label}
                        {option.count > 0 && (
                          <span>({option.count})</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Фильтры по категориям */}
          {categoryFilterGroups.map((group) => (
            <div key={group.id} className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup(group.id)}
              >
                <h3>{group.name}</h3>
                <span className={`${styles.collapseIcon} ${group.expanded ? '' : styles.rotatedIcon}`}>
                  <AccordeonIcon />
                </span>
              </div>
              
              <div className={`${styles.filterContent} ${group.expanded ? styles.expanded : ''}`}>
                <div className={styles.filterOptions}>
                  {group.options.map((option) => (
                    <div key={`${group.id}-${option.value}`} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        id={`${group.id}-mobile-${option.value}`}
                        checked={selectedFilters[group.id]?.includes(option.value) || false}
                        onChange={() => handleFilterChange(group.id, option.value)}
                      />
                      <label htmlFor={`${group.id}-mobile-${option.value}`}>
                        {option.label}
                        {option.count > 0 && (
                          <span>({option.count})</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Динамические фильтры по атрибутам продуктов */}
          {attributeFilterGroups.slice(1).map((group) => (
            <div key={group.id} className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup(group.id)}
              >
                <h3>{group.name}</h3>
                <span className={`${styles.collapseIcon} ${group.expanded ? '' : styles.rotatedIcon}`}>
                  <AccordeonIcon />
                </span>
              </div>
              
              <div className={`${styles.filterContent} ${group.expanded ? styles.expanded : ''}`}>
                <div className={styles.filterOptions}>
                  {group.options.map((option) => (
                    <div key={`${group.id}-${option.value}`} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        id={`${group.id}-mobile-${option.value}`}
                        checked={selectedFilters[group.id]?.includes(option.value) || false}
                        onChange={() => handleFilterChange(group.id, option.value)}
                      />
                      {(group.name.toLowerCase().includes('цвет') || group.name.toLowerCase().includes('color') || group.name.toLowerCase().includes('колір')) && (
                        <span 
                          className={styles.colorSquare}
                          style={{ backgroundColor: getColorCode(option.value) }}
                        />
                      )}
                      <label htmlFor={`${group.id}-mobile-${option.value}`}>
                        {option.label}
                        {option.count > 0 && (
                          <span>({option.count})</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Кнопка сброса фильтров */}
          <button className={styles.resetButton} onClick={resetFilters}>
            Скинути фільтр
          </button>
        </div>
      </div>
      
      <div className={styles.catalogContent}>
        {/* Сайдбар с фильтрами (только для десктопа) */}
        <div className={styles.filterSidebar}>
          {/* Фильтр по цене */}
          <div className={styles.filterGroup}>
            <div 
              className={styles.filterHeader} 
              onClick={() => toggleFilterGroup('price')}
            >
              <h3>Ціна</h3>
              <span className={`${styles.collapseIcon} ${attributeFilterGroups[0]?.expanded ? '' : styles.rotatedIcon}`}>
                <AccordeonIcon />
              </span>
            </div>
            
            <div className={`${styles.filterContent} ${attributeFilterGroups[0]?.expanded ? styles.expanded : ''}`}>
              <div className={styles.priceRange}>
                <div className={styles.rangeValues}>
                  <span>{currentPriceRange[0]}</span>
                  <span>{currentPriceRange[1]}</span>
                </div>
                <div className={styles.rangeSliders}>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={currentPriceRange[1]}
                    onChange={(e) => handlePriceRangeChange(currentPriceRange[0], Number(e.target.value))}
                    className={styles.rangeSlider}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* НОВОЕ: Фильтр по продуктам */}
          {productFilterGroup && (
            <div className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup('products')}
              >
                <h3>{productFilterGroup.name}</h3>
                <span className={`${styles.collapseIcon} ${productFilterGroup.expanded ? '' : styles.rotatedIcon}`}>
                  <AccordeonIcon />
                </span>
              </div>
              
              <div className={`${styles.filterContent} ${productFilterGroup.expanded ? styles.expanded : ''}`}>
                <div className={styles.filterOptions}>
                  {productFilterGroup.options.map((option) => (
                    <div key={`products-${option.value}`} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        id={`products-${option.value}`}
                        checked={selectedFilters['products']?.includes(option.value) || false}
                        onChange={() => handleFilterChange('products', option.value)}
                      />
                      <label htmlFor={`products-${option.value}`}>
                        {option.label}
                        {option.count > 0 && (
                          <span>({option.count})</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Фильтры по категориям */}
          {categoryFilterGroups.map((group) => (
            <div key={group.id} className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup(group.id)}
              >
                <h3>{group.name}</h3>
                <span className={`${styles.collapseIcon} ${group.expanded ? '' : styles.rotatedIcon}`}>
                  <AccordeonIcon />
                </span>
              </div>
              
              <div className={`${styles.filterContent} ${group.expanded ? styles.expanded : ''}`}>
                <div className={styles.filterOptions}>
                  {group.options.map((option) => (
                    <div key={`${group.id}-${option.value}`} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        id={`${group.id}-${option.value}`}
                        checked={selectedFilters[group.id]?.includes(option.value) || false}
                        onChange={() => handleFilterChange(group.id, option.value)}
                      />
                      <label htmlFor={`${group.id}-${option.value}`}>
                        {option.label}
                        {option.count > 0 && (
                          <span>({option.count})</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Динамические фильтры по атрибутам продуктов */}
          {attributeFilterGroups.slice(1).map((group) => (
            <div key={group.id} className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup(group.id)}
              >
                <h3>{group.name}</h3>
                <span className={`${styles.collapseIcon} ${group.expanded ? '' : styles.rotatedIcon}`}>
                  <AccordeonIcon />
                </span>
              </div>
              
              <div className={`${styles.filterContent} ${group.expanded ? styles.expanded : ''}`}>
                <div className={styles.filterOptions}>
                  {group.options.map((option) => (
                    <div key={`${group.id}-${option.value}`} className={styles.filterOption}>
                      <input
                        type="checkbox"
                        id={`${group.id}-${option.value}`}
                        checked={selectedFilters[group.id]?.includes(option.value) || false}
                        onChange={() => handleFilterChange(group.id, option.value)}
                      />
                      {(group.name.toLowerCase().includes('цвет') || group.name.toLowerCase().includes('color') || group.name.toLowerCase().includes('колір')) && (
                        <span 
                          className={styles.colorSquare}
                          style={{ backgroundColor: getColorCode(option.value) }}
                        />
                      )}
                      <label htmlFor={`${group.id}-${option.value}`}>
                        {option.label}
                        {option.count > 0 && (
                          <span>({option.count})</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Кнопка сброса фильтров */}
          <button className={styles.resetButton} onClick={resetFilters}>
            Сбросить фильтр
          </button>
        </div>

        {/* Сетка продуктов */}
        <div className={styles.productGrid}>
          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : filteredVariants.length === 0 ? (
            <div className={styles.noResults}>Нет товаров, соответствующих выбранным фильтрам</div>
          ) : (
            filteredVariants.map(({ product, variant }, index) => (
              <div key={`variant-${index}`} className={styles.productCardWrapper}>
                <ProductCard 
                  product={{
                    ...product,
                    variants: [variant] // Передаем только один отфильтрованный вариант
                  }} 
                />
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Затемнение фона при открытых фильтрах */}
      {isFilterPanelOpen && (
        <div className={styles.overlay} onClick={toggleFilterPanel}></div>
      )}
    </div>
  );
}