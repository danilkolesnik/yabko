// 'use client';
// // src/components/CatalogPage.tsx
// import React, { useState, useEffect } from 'react';
// import styles from './CatalogPage.module.scss';
// import ProductCard from '@/components/ProductCard';
// import Link from 'next/link';

// // Базовые интерфейсы
// interface ProductImage {
//   id?: string;
//   url: string;
// }

// interface ProductPrice {
//   id?: string;
//   amount: number;
//   currency_code: string;
// }

// interface ProductVariant {
//   id: string;
//   title?: string;
//   prices?: ProductPrice[];
// }

// interface ProductOption {
//   id?: string;
//   title: string;
//   values: string[];
// }

// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   handle: string;
//   images: ProductImage[];
//   variants: ProductVariant[];
//   options?: ProductOption[];
// }

// interface Category {
//   id: string;
//   name: string;
//   handle: string;
// }

// interface CatalogPageProps {
//   category: Category;
//   products: Product[];
//   breadcrumbs?: { name: string; path: string }[];
// }

// // Интерфейсы для динамических фильтров
// interface FilterOption {
//   id: string;        // Уникальный идентификатор опции
//   name: string;      // Отображаемое название
//   count: number;     // Количество продуктов с этой опцией
//   value: string;     // Значение для фильтрации
// }

// interface FilterGroup {
//   id: string;                // Уникальный идентификатор группы
//   name: string;              // Отображаемое название группы
//   options: FilterOption[];   // Доступные опции в группе
//   expanded: boolean;         // Развернута ли группа
//   type: string;              // Тип фильтра (color, memory, size, etc.)
// }

// export default function CatalogPage({ category, products = [], breadcrumbs = [] }: CatalogPageProps) {
//   // Состояния
//   const [filteredVariants, setFilteredVariants] = useState<{product: Product, variant: ProductVariant}[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [allFoundOptions, setAllFoundOptions] = useState<Record<string, string[]>>({});
//   const [originalProductOptions, setOriginalProductOptions] = useState<Record<string, string[]>>({});
  
//   // Ценовой диапазон
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
//   const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 100000]);
  
//   // Динамические фильтры
//   const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  
//   // Выбранные фильтры (хранение по id опции)
//   const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  
//   // Первоначальная инициализация данных
//   useEffect(() => {
//     if (products.length > 0) {
//       console.log("Инициализация с", products.length, "товарами");
      
//       // Вывод сырых данных первого продукта для отладки
//       if (products[0]) {
//         console.log("СЫРЫЕ ДАННЫЕ ПЕРВОГО ПРОДУКТА:", JSON.stringify(products[0], null, 2));
//       }
      
//       // Специальная проверка - выводим ВСЕ опции и все поля первых 3 продуктов
//       products.slice(0, 3).forEach(product => {
//         console.log(`ПРОДУКТ [${product.id}]: ${product.title}`);
//         console.log(`- Все поля:`, Object.keys(product));
//         console.log(`- Опции:`, product.options ? product.options.map(o => o.title) : 'нет');
//         console.log(`- Варианты:`, product.variants ? product.variants.length : 0);
//         if (product.variants && product.variants[0]) {
//           console.log(`- Пример варианта:`, product.variants[0].title);
//           console.log(`- Все поля варианта:`, Object.keys(product.variants[0]));
//         }
//       });
      
//       // Собираем уникальные опции из метаданных продуктов
//       const allOriginalOptions: Record<string, Set<string>> = {};
//       const seenProductIds = new Set<string>();
      
//       products.forEach(product => {
//         if (seenProductIds.has(product.id)) return; // Избегаем дублирования
//         seenProductIds.add(product.id);
        
//         // Выводим все опции продукта в их оригинальном виде
//         if (product.options && Array.isArray(product.options)) {
//           console.log(`Продукт ${product.id} (${product.title}) опции:`, product.options.map(o => o.title));
          
//           product.options.forEach(option => {
//             if (option && option.title) {
//               // Используем оригинальное название опции без преобразований
//               const optionName = option.title;
              
//               if (!allOriginalOptions[optionName]) {
//                 allOriginalOptions[optionName] = new Set<string>();
//               }
              
//               // Добавляем все значения
//               if (option.values && Array.isArray(option.values)) {
//                 option.values.forEach(value => {
//                   if (typeof value === 'string') {
//                     allOriginalOptions[optionName].add(value);
//                   }
//                 });
//               }
//             }
//           });
//         }
//       });
      
//       // Преобразуем в обычный объект для отладки
//       const originalOptionsObj: Record<string, string[]> = {};
//       Object.entries(allOriginalOptions).forEach(([name, valuesSet]) => {
//         originalOptionsObj[name] = Array.from(valuesSet);
//       });
      
//       console.log("Оригинальные опции из метаданных:", originalOptionsObj);
//       setOriginalProductOptions(originalOptionsObj);
      
//       // Собираем все варианты всех продуктов
//       const allVariants = products.flatMap(product => 
//         (product.variants || []).map(variant => ({ product, variant }))
//       );
      
//       // Устанавливаем варианты
//       setFilteredVariants(allVariants);
      
//       // Извлекаем цены
//       extractPriceRange(allVariants);
      
//       // Извлекаем опции для динамических фильтров
//       extractDynamicFilterOptions(allVariants, allOriginalOptions);
      
//       setLoading(false);
//     }
//   }, [products]);
  
//   // Извлечение ценового диапазона
//   const extractPriceRange = (variants: {product: Product, variant: ProductVariant}[]) => {
//     try {
//       const prices: number[] = [];
      
//       variants.forEach(({ variant }) => {
//         if (!variant.prices) return;
        
//         variant.prices.forEach(price => {
//           if (price && typeof price.amount === 'number') {
//             prices.push(price.amount / 100);
//           }
//         });
//       });
      
//       if (prices.length > 0) {
//         const minPrice = Math.floor(Math.min(...prices));
//         const maxPrice = Math.ceil(Math.max(...prices));
//         console.log(`Установка ценового диапазона: ${minPrice} - ${maxPrice}`);
//         setPriceRange([minPrice, maxPrice]);
//         setCurrentPriceRange([minPrice, maxPrice]);
//       }
//     } catch (error) {
//       console.error("Ошибка при извлечении ценового диапазона:", error);
//     }
//   };
  
//   // Извлечение опций для динамических фильтров
//   const extractDynamicFilterOptions = (
//     variants: {product: Product, variant: ProductVariant}[],
//     originalOptions: Record<string, Set<string>>
//   ) => {
//     try {
//       console.log("Начинаем извлечение опций из", variants.length, "вариантов");
      
//       // Объекты для хранения опций и их значений
//       const optionMap: Record<string, Set<string>> = {};
//       const optionCounts: Record<string, Record<string, number>> = {};
      
//       // Для отладки - собираем все найденные опции
//       const allOptions: Record<string, string[]> = {};
      
//       // Функция для добавления опции и значения
//       const addOptionValue = (optionName: string, value: string) => {
//         // Для отладки
//         if (!allOptions[optionName]) {
//           allOptions[optionName] = [];
//         }
//         if (!allOptions[optionName].includes(value)) {
//           allOptions[optionName].push(value);
//         }
        
//         // Создаем множество для опции, если его еще нет
//         if (!optionMap[optionName]) {
//           optionMap[optionName] = new Set<string>();
//           optionCounts[optionName] = {};
//         }
        
//         // Добавляем значение в множество
//         optionMap[optionName].add(value);
        
//         // Увеличиваем счетчик
//         optionCounts[optionName][value] = (optionCounts[optionName][value] || 0) + 1;
//       };
      
//       // Поиск опций в таблице атрибутов продукта
//       const findOptionsInProductTable = (product: Product) => {
//         // Проверяем наличие таблицы атрибутов (обычно это поле attributes или properties)
//         const attributes = (product as any).attributes || (product as any).properties || [];
        
//         if (Array.isArray(attributes) && attributes.length > 0) {
//           console.log(`Найдена таблица атрибутов продукта, элементов: ${attributes.length}`);
          
//           attributes.forEach(attr => {
//             if (!attr) return;
            
//             // Проверяем наличие и тип поля
//             if (typeof attr === 'object') {
//               const name = attr.name || attr.key || attr.title;
//               const value = attr.value || attr.text;
              
//               if (name && value) {
//                 console.log(`Атрибут: ${name} = ${value}`);
                
//                 // Пытаемся определить тип опции
//                 let optionType = '';
//                 const nameLower = name.toLowerCase();
                
//                 if (nameLower.includes('color') || nameLower.includes('цвет')) {
//                   optionType = 'color';
//                 } else if (nameLower.includes('size') || nameLower.includes('размер')) {
//                   optionType = 'size';
//                 } else if (nameLower.includes('storage') || nameLower.includes('память') || 
//                            nameLower.includes('объем')) {
//                   optionType = 'Storage';
//                 }
                
//                 // Если определили тип, добавляем опцию
//                 if (optionType) {
//                   addOptionValue(optionType, String(value).toLowerCase());
//                   console.log(`  Добавлен атрибут как опция: ${optionType} = ${value}`);
//                 }
//               }
//             }
//           });
//         }
//       };
      
//       // Анализируем таблицы атрибутов продуктов
//       console.log("Поиск опций в таблицах атрибутов продуктов:");
//       const productSet = new Set<string>();
//       variants.forEach(({ product }) => {
//         if (productSet.has(product.id)) return; // Пропускаем если продукт уже обработан
//         productSet.add(product.id);
        
//         findOptionsInProductTable(product);
//       });
      
//       // Анализируем все варианты для извлечения опций
//       console.log("Извлечение опций из названий вариантов:");
//       variants.forEach(({ variant, product }) => {
//         if (!variant.title) return;
        
//         console.log(`  Анализ варианта: ${variant.title}`);
        
//         // Сначала проверяем соответствие варианта опциям продукта
//         if (product.options && Array.isArray(product.options)) {
//           product.options.forEach(option => {
//             if (!option || !option.title || !option.values) return;
            
//             // Используем оригинальное название опции БЕЗ преобразования в нижний регистр
//             const optionName = option.title;
            
//             // Проверяем каждое значение опции
//             option.values.forEach(value => {
//               if (typeof value !== 'string') return;
              
//               // Проверяем, содержит ли название варианта значение опции
//               if (variant.title?.toLowerCase().includes(value.toLowerCase())) {
                
//                 addOptionValue(optionName, value.toLowerCase());
//                 console.log(`    Соответствие опции ${optionName}: ${value}`);
//               }
//             });
//           });
//         }
        
//         // Попытка извлечь структурированные опции
//         const structuredOptions = extractStructuredOptions(variant.title);
        
//         if (Object.keys(structuredOptions).length > 0) {
//           console.log("    Извлечены структурированные опции:", structuredOptions);
//           // Если нашли структурированные опции
//           Object.entries(structuredOptions).forEach(([optionName, value]) => {
//             addOptionValue(optionName, value);
//           });
//         } else {
//           console.log("    Структурированные опции не найдены. Применяем эвристики...");
          
//   // Эвристическое извлечение опций
//           const title = variant.title.toLowerCase();
          
//           // Проверяем тип опции по названию продукта и варианта
//           const hasStorageFlag = 
//             product.title.toLowerCase().includes('storage') ||
//             variant.title.toLowerCase().includes('storage');
          
//           // Извлекаем цвета
//           const colorKeywords = [
//             'black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 
//             'pink', 'gold', 'silver', 'graphite', 'gray', 'space gray', 
//             'midnight', 'starlight', 'product red'
//           ];
          
//           // Проверяем каждый цвет
//           for (const color of colorKeywords) {
//             if (title.includes(color)) {
//               addOptionValue('color', color);
//               console.log(`      Найден цвет: ${color}`);
//               break;
//             }
//           }
          
//           // Извлекаем объем памяти/хранилища
//           const storageMatch = title.match(/(\d+)(gb|tb)/i);
//           if (storageMatch && storageMatch[1] && storageMatch[2]) {
//             const storageValue = `${storageMatch[1]}${storageMatch[2].toUpperCase()}`;
            
//             // Определяем, это storage или memory на основе контекста
//             if (hasStorageFlag || title.includes('storage') || 
//                 (originalOptions['Storage'] && 
//                  originalOptions['Storage'].has(storageValue))) {
//               addOptionValue('Storage', storageValue.toLowerCase());
//               console.log(`      Найдено хранилище: ${storageValue}`);
//             } else if (title.includes('memory') || title.includes('ram') || 
//                       (originalOptions['memory'] && 
//                        originalOptions['memory'].has(storageValue))) {
//               addOptionValue('memory', storageValue.toLowerCase());
//               console.log(`      Найдена память: ${storageValue}`);
//             } else {
//               // Если не можем точно определить тип, смотрим на метаданные продукта
//               if (originalOptions['Storage']) {
//                 addOptionValue('Storage', storageValue.toLowerCase());
//                 console.log(`      Предполагаемое хранилище: ${storageValue}`);
//               } else {
//                 addOptionValue('memory', storageValue.toLowerCase());
//                 console.log(`      Предполагаемая память: ${storageValue}`);
//               }
//             }
//           }
          
//           // Извлекаем размеры
//           const sizeMatch = title.match(/\b(size|размер)?\s*(\d+|xs|s|m|l|xl|xxl|xxxl)\b/i);
//           if (sizeMatch && sizeMatch[2]) {
//             const size = sizeMatch[2].toUpperCase();
//             addOptionValue('size', size.toLowerCase());
//             console.log(`      Найден размер: ${size}`);
//           }
          
//           // Проверяем состояние (новый, б/у, восстановленный)
//           const conditionKeywords = ['new', 'used', 'refurbished', 'renewed', 'open box', 'новый', 'б/у', 'восстановленный'];
//           for (const condition of conditionKeywords) {
//             if (title.includes(condition)) {
//               addOptionValue('condition', condition);
//               console.log(`      Найдено состояние: ${condition}`);
//               break;
//             }
//           }
          
//           // Процессоры
//           const processorMatch = title.match(/\b(i\d|ryzen|snapdragon|a\d+|m\d)\b/i);
//           if (processorMatch) {
//             const processor = processorMatch[0].toLowerCase();
//             addOptionValue('processor', processor);
//             console.log(`      Найден процессор: ${processor}`);
//           }
          
//           // Материал
//           const materialKeywords = ['leather', 'cotton', 'wool', 'silk', 'nylon', 'polyester', 'metal', 'plastic', 'glass'];
//           for (const material of materialKeywords) {
//             if (title.includes(material)) {
//               addOptionValue('material', material);
//               console.log(`      Найден материал: ${material}`);
//               break;
//             }
//           }
//         }
//       });
      
//       // Сохраняем все найденные опции в состояние для отладки
//       setAllFoundOptions(allOptions);
//       console.log("Все найденные опции:", allOptions);
      
//       // Словарь для перевода стандартных названий опций
//       const optionTranslations: Record<string, string> = {
//         'color': 'color', // Оставляем как есть по требованию
//         'memory': 'Память',
//         'size': 'Размер',
//         'processor': 'Процессор',
//         'material': 'Материал',
//         'weight': 'Вес',
//         'capacity': 'Емкость',
//         'generation': 'Поколение',
//         'version': 'Версия',
//         'condition': 'Состояние', // Добавляем перевод для третьей опции
//         'year': 'Год',
//         'model': 'Модель',
//         'os': 'ОС',
//         'screen': 'Экран',
//         'battery': 'Батарея',
//         'camera': 'Камера',
//         'storage': 'Хранилище',
//         'warranty': 'Гарантия',
//         'type': 'Тип',
//         'feature': 'Особенность'
//       };
      
//       // Функция для получения названия группы
//       const getGroupDisplayName = (optionName: string): string => {
//         console.log(`Получение отображаемого имени для опции: ${optionName}`);
        
//         // Если это color, оставляем как есть
//         if (optionName.toLowerCase().includes('color')) {
//           console.log(`  Это опция цвета, оставляем оригинальное название: ${optionName}`);
//           return optionName;
//         }
        
//         // Проверяем, есть ли перевод
//         if (optionTranslations[optionName.toLowerCase()]) {
//           const translated = optionTranslations[optionName.toLowerCase()];
//           console.log(`  Найден перевод: ${translated}`);
//           return translated;
//         }
        
//         // Если нет перевода, используем исходное название с заглавной буквы
//         const capitalized = optionName.charAt(0).toUpperCase() + optionName.slice(1);
//         console.log(`  Используем с заглавной буквы: ${capitalized}`);
//         return capitalized;
//       };
      
//   // Создаем группы фильтров из найденных опций
//       const dynamicFilterGroups: FilterGroup[] = [];
      
//       // Словарь для сохранения оригинального регистра названий опций
//       const originalOptionCaseMap: Record<string, string> = {};
      
//       // Приоритет для опций продукта - используем оригинальные названия
//       const productOptionNames = Object.keys(originalOptions);
//       console.log("Создание групп фильтров из оригинальных опций:", productOptionNames);
      
//       // Сохраняем оригинальный регистр названий опций
//       productOptionNames.forEach(name => {
//         originalOptionCaseMap[name.toLowerCase()] = name;
//       });
      
//       // Сперва добавляем группы из оригинальных опций продукта
//       productOptionNames.forEach(optionName => {
//         const values = originalOptions[optionName];
//         if (values.size > 0) {
//           const displayName = optionName.toLowerCase().includes('color') 
//             ? optionName  // Оставляем "color" без изменений
//             : getGroupDisplayName(optionName);
          
//           const filterOptions: FilterOption[] = Array.from(values).map(value => ({
//             id: `${optionName}-${value.replace(/\s+/g, '-').toLowerCase()}`,
//             name: value, // Используем оригинальное значение без преобразований
//             value: value.toLowerCase(), // Для фильтрации используем нижний регистр
//             count: optionCounts[optionName]?.[value.toLowerCase()] || 0
//           })).sort((a, b) => a.name.localeCompare(b.name));
          
//           dynamicFilterGroups.push({
//             id: optionName.toLowerCase(), // ID в нижнем регистре для согласованности
//             name: displayName,
//             options: filterOptions,
//             expanded: true,
//             type: optionName
//           });
          
//           console.log(`Создана группа из оригинальной опции: ${displayName} (${filterOptions.length} значений)`);
//         }
//       });
      
//       // Затем добавляем группы из эвристик (если их еще нет)
//       Object.entries(optionMap).forEach(([optionName, values]) => {
//         // Проверяем есть ли эта опция (с учетом регистра) в оригинальных опциях
//         const lowerCaseName = optionName.toLowerCase();
//         if (Object.keys(originalOptionCaseMap).includes(lowerCaseName)) {
//           // Если эта опция уже добавлена из метаданных продукта, пропускаем её
//           console.log(`Пропускаем эвристическую опцию "${optionName}", так как она уже есть в метаданных`);
//           return;
//         }
        
//         // Проверяем специальный случай для Storage/memory
//         if (lowerCaseName === 'storage' && 
//             Object.keys(originalOptionCaseMap).includes('memory')) {
//           console.log(`Особая обработка: опция "${optionName}" может быть связана с "memory"`);
          
//           // Дополняем существующую группу memory, если нашли Storage эвристически
//           const memoryGroup = dynamicFilterGroups.find(g => 
//             g.id.toLowerCase() === 'memory' || 
//             g.type.toLowerCase() === 'memory'
//           );
          
//           if (memoryGroup) {
//             console.log(`Добавляем значения Storage в группу memory`);
            
//             const newOptions = Array.from(values).map(value => ({
//               id: `Storage-${value.replace(/\s+/g, '-')}`,
//               name: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize
//               value: value,
//               count: optionCounts[optionName][value] || 0
//             }));
            
//             memoryGroup.options = [...memoryGroup.options, ...newOptions]
//               .sort((a, b) => a.name.localeCompare(b.name));
            
//             return;
//           }
//         }
        
//         // Стандартная обработка эвристической опции
//         if (values.size > 0) {
//           const displayName = getGroupDisplayName(optionName);
          
//           const filterOptions: FilterOption[] = Array.from(values).map(value => ({
//             id: `${optionName}-${value.replace(/\s+/g, '-')}`,
//             name: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize
//             value: value,
//             count: optionCounts[optionName][value] || 0
//           })).sort((a, b) => a.name.localeCompare(b.name));
          
//           dynamicFilterGroups.push({
//             id: optionName,
//             name: displayName,
//             options: filterOptions,
//             expanded: true,
//             type: optionName
//           });
          
//           console.log(`Создана группа из эвристической опции: ${displayName} (${filterOptions.length} значений)`);
//         }
//       });
      
//       // Приоритеты для сортировки групп
//       const groupPriorities: Record<string, number> = {
//         'color': 1,
//         'memory': 2,
//         'size': 3,
//         'condition': 4,
//         'processor': 5,
//         'material': 6
//       };
      
//       // Сортируем группы по приоритету
//       dynamicFilterGroups.sort((a, b) => {
//         const priorityA = groupPriorities[a.id.toLowerCase()] || 999;
//         const priorityB = groupPriorities[b.id.toLowerCase()] || 999;
//         return priorityA - priorityB;
//       });
      
//       // Добавляем ценовой фильтр
//       dynamicFilterGroups.unshift({
//         id: 'price',
//         name: 'Цена',
//         options: [],
//         expanded: true,
//         type: 'price'
//       });
      
//       console.log("Созданы группы фильтров:", dynamicFilterGroups.map(g => `${g.name} (${g.options.length} значений)`));
//       setFilterGroups(dynamicFilterGroups);
      
//       // Инициализация выбранных фильтров
//       const initialSelectedFilters: Record<string, string[]> = {};
//       dynamicFilterGroups.forEach(group => {
//         initialSelectedFilters[group.id] = [];
//       });
//       setSelectedFilters(initialSelectedFilters);
      
//     } catch (error) {
//       console.error("Ошибка при извлечении опций фильтров:", error);
//       console.error(error.stack);
//     }
//   };
  
//   // Функция для извлечения структурированных опций из строки
//   const extractStructuredOptions = (title: string): Record<string, string> => {
//     const options: Record<string, string> = {};
    
//     // Проверяем разные форматы определения опций
    
//     // Формат "Опция: Значение, Опция: Значение"
//     const colonPattern = /(\w+):\s*([^,]+)(?:,|$)/g;
//     let match;
//     while ((match = colonPattern.exec(title)) !== null) {
//       const optionName = match[1].trim().toLowerCase();
//       const optionValue = match[2].trim().toLowerCase();
//       options[optionName] = optionValue;
//     }
    
//     // Формат "Опция = Значение; Опция = Значение"
//     if (Object.keys(options).length === 0) {
//       const equalsPattern = /(\w+)\s*=\s*([^;]+)(?:;|$)/g;
//       while ((match = equalsPattern.exec(title)) !== null) {
//         const optionName = match[1].trim().toLowerCase();
//         const optionValue = match[2].trim().toLowerCase();
//         options[optionName] = optionValue;
//       }
//     }
    
//     // Формат с разделителями "|" или "/"
//     if (Object.keys(options).length === 0) {
//       const parts = title.split(/[|\/]/);
//       if (parts.length > 1) {
//         parts.forEach(part => {
//           const trimmedPart = part.trim().toLowerCase();
          
//           // Пытаемся определить тип опции
//           if (/\d+\s*(gb|tb)/i.test(trimmedPart)) {
//             options['memory'] = trimmedPart;
//           } else if (/\b(xs|s|m|l|xl)\b/i.test(trimmedPart)) {
//             options['size'] = trimmedPart;
//           } else if (/\b(black|white|red|blue|green|yellow)\b/i.test(trimmedPart)) {
//             options['color'] = trimmedPart;
//           } else if (/\b(i\d|ryzen|snapdragon|a\d+)\b/i.test(trimmedPart)) {
//             options['processor'] = trimmedPart;
//           }
//         });
//       }
//     }
    
//     return options;
//   };
  
//   // Обработчик изменения чекбокса фильтра
//   const handleFilterChange = (groupId: string, value: string) => {
//     setSelectedFilters(prev => {
//       const groupValues = [...(prev[groupId] || [])];
      
//       if (groupValues.includes(value)) {
//         // Удаляем значение, если оно уже выбрано
//         return {
//           ...prev,
//           [groupId]: groupValues.filter(v => v !== value)
//         };
//       } else {
//         // Добавляем новое значение
//         return {
//           ...prev,
//           [groupId]: [...groupValues, value]
//         };
//       }
//     });
//   };
  
//   // Применение фильтров
//   useEffect(() => {
//     if (products.length === 0) return;
    
//     setLoading(true);
    
//     try {
//       // Собираем все варианты всех продуктов
//       let filteredItems = products.flatMap(product => 
//         (product.variants || []).map(variant => ({ product, variant }))
//       );
      
//       console.log(`Начало фильтрации. Исходное количество вариантов: ${filteredItems.length}`);
      
//       // Фильтр по цене
//       filteredItems = filteredItems.filter(({ variant }) => {
//         if (!variant.prices || variant.prices.length === 0) return true;
        
//         return variant.prices.some(price => {
//           if (!price || typeof price.amount !== 'number') return true;
          
//           const priceValue = price.amount / 100;
//           return priceValue >= currentPriceRange[0] && priceValue <= currentPriceRange[1];
//         });
//       });
      
//       console.log(`После фильтрации по цене: ${filteredItems.length} вариантов`);
      
//       // Применяем фильтры по группам
//       Object.entries(selectedFilters).forEach(([groupId, values]) => {
//         if (values.length === 0 || groupId === 'price') return; // Пропускаем, если не выбраны значения или это ценовой фильтр
        
//         console.log(`Применение фильтра [${groupId}] со значениями:`, values);
        
//         const prevCount = filteredItems.length;
        
//         filteredItems = filteredItems.filter(({ variant, product }) => {
//           if (!variant.title) return false;
          
//           const title = variant.title.toLowerCase();
          
//           // Проверяем, содержит ли название хотя бы одно из выбранных значений
//           const matchesByTitle = values.some(value => {
//             const includes = title.includes(value.toLowerCase());
//             return includes;
//           });
          
//           if (matchesByTitle) {
//             return true;
//           }
          
//           // Проверяем, если у продукта есть метаданные опций
//           if (product.options && Array.isArray(product.options)) {
//             for (const option of product.options) {
//               // Проверяем, что option существует и имеет свойство name
//               if (!option || !option.title) continue;
              
//               // Проверяем, соответствует ли название опции текущему фильтру
//               if (option.title.toLowerCase() === groupId.toLowerCase()) {
//                 if (!option.values || !Array.isArray(option.values)) continue;
                
//                 // Проверяем, есть ли пересечение между значениями опции и выбранными значениями фильтра
//                 for (const optionValue of option.values) {
//                   if (typeof optionValue !== 'string') continue;
                  
//                   for (const filterValue of values) {
//                     if (optionValue.toLowerCase() === filterValue.toLowerCase()) {
//                       return true;
//                     }
//                   }
//                 }
//               }
//             }
//           }
          
//           return false;
//         });
        
//         console.log(`После фильтра [${groupId}]: ${filteredItems.length} вариантов (было ${prevCount})`);
//       });
      
//       console.log(`Отфильтровано ${filteredItems.length} вариантов из общего количества`);
//       setFilteredVariants(filteredItems);
//     } catch (error) {
//       console.error("Ошибка при применении фильтров:", error);
//       console.error(error.stack);
//       // В случае ошибки показываем все варианты
//       const allVariants = products.flatMap(product => 
//         (product.variants || []).map(variant => ({ product, variant }))
//       );
//       setFilteredVariants(allVariants);
//     } finally {
//       setLoading(false);
//     }
//   }, [products, currentPriceRange, selectedFilters]);
  
//   // Переключение развернутости фильтра
//   const toggleFilterGroup = (groupId: string) => {
//     setFilterGroups(prevGroups => 
//       prevGroups.map(group => 
//         group.id === groupId ? { ...group, expanded: !group.expanded } : group
//       )
//     );
//   };
  
//   // Обработчик изменения ценового диапазона
//   const handlePriceRangeChange = (min: number, max: number) => {
//     setCurrentPriceRange([min, max]);
//   };
  
//   // Сброс фильтров
//   const resetFilters = () => {
//     // Сбрасываем все выбранные фильтры
//     const resetSelections: Record<string, string[]> = {};
//     filterGroups.forEach(group => {
//       resetSelections[group.id] = [];
//     });
//     setSelectedFilters(resetSelections);
    
//     // Сбрасываем ценовой диапазон
//     setCurrentPriceRange(priceRange);
//   };
  
//   // Функция для определения цвета по названию
//   const getColorCode = (colorName: string): string => {
//     const colorMap: Record<string, string> = {
//       'black': '#000000',
//       'white': '#FFFFFF',
//       'red': '#FF0000',
//       'blue': '#0000FF',
//       'green': '#008000',
//       'yellow': '#FFFF00',
//       'purple': '#800080',
//       'pink': '#FFC0CB',
//       'gold': '#FFD700',
//       'silver': '#C0C0C0',
//       'graphite': '#333333',
//       'gray': '#808080',
//       'space gray': '#676767',
//       'midnight': '#121212',
//       'starlight': '#F9F3EE',
//       'product red': '#FF0000',
//     };
    
//     return colorMap[colorName.toLowerCase()] || '#CCCCCC';
//   };
  
//   // Если продуктов нет
//   if (products.length === 0) {
//     return (
//       <div className={styles.catalogContainer}>
//         <h1 className={styles.categoryTitle}>{category?.name || 'Категория'}</h1>
//         <div className={styles.noResults}>В данной категории нет товаров</div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.catalogContainer}>
//       {/* Хлебные крошки */}
//       {breadcrumbs && breadcrumbs.length > 0 && (
//         <div className={styles.breadcrumbs}>
//           <Link href="/">Главная</Link>
//           {breadcrumbs.map((crumb, index) => (
//             <React.Fragment key={index}>
//               <span className={styles.breadcrumbSeparator}>/</span>
//               <Link href={crumb.path}>{crumb.name}</Link>
//             </React.Fragment>
//           ))}
//         </div>
//       )}

//       {/* Заголовок категории */}
//       <h1 className={styles.categoryTitle}>{category?.name || 'Категория'}</h1>

//       <div className={styles.catalogContent}>
//         {/* Сайдбар с фильтрами */}
//         <div className={styles.filterSidebar}>
//           {/* Фильтр по цене */}
//           <div className={styles.filterGroup}>
//             <div 
//               className={styles.filterHeader} 
//               onClick={() => toggleFilterGroup('price')}
//             >
//               <h3>Цена</h3>
//               <span className={styles.collapseIcon}>
//                 {filterGroups.find(g => g.id === 'price')?.expanded ? '▲' : '▼'}
//               </span>
//             </div>
            
//             {(filterGroups.find(g => g.id === 'price')?.expanded !== false) && (
//               <div className={styles.priceRange}>
//                 <div className={styles.rangeValues}>
//                   <span>{currentPriceRange[0]} ₴</span>
//                   <span>{currentPriceRange[1]} ₴</span>
//                 </div>
//                 <div className={styles.rangeSliders}>
//                   <input
//                     type="range"
//                     min={priceRange[0]}
//                     max={priceRange[1]}
//                     value={currentPriceRange[0]}
//                     onChange={(e) => handlePriceRangeChange(Number(e.target.value), currentPriceRange[1])}
//                     className={styles.rangeSlider}
//                   />
//                   <input
//                     type="range"
//                     min={priceRange[0]}
//                     max={priceRange[1]}
//                     value={currentPriceRange[1]}
//                     onChange={(e) => handlePriceRangeChange(currentPriceRange[0], Number(e.target.value))}
//                     className={styles.rangeSlider}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Динамические фильтры */}
//           {filterGroups.filter(group => group.id !== 'price').map((group) => (
//             <div key={group.id} className={styles.filterGroup}>
//               <div 
//                 className={styles.filterHeader} 
//                 onClick={() => toggleFilterGroup(group.id)}
//               >
//                 <h3>{group.name}</h3>
//                 <span className={styles.collapseIcon}>
//                   {group.expanded ? '▲' : '▼'}
//                 </span>
//               </div>
              
//               {group.expanded && (
//                 <div className={styles.filterContent}>
//                   <div className={styles.filterOptions}>
//                     {group.options.map((option) => (
//                       <div key={option.id} className={styles.filterOption}>
//                         <input
//                           type="checkbox"
//                           id={option.id}
//                           checked={selectedFilters[group.id]?.includes(option.value) || false}
//                           onChange={() => handleFilterChange(group.id, option.value)}
//                         />
//                         {group.type.toLowerCase().includes('color') && (
//                           <span 
//                             className={styles.colorSquare}
//                             style={{ backgroundColor: getColorCode(option.value) }}
//                           />
//                         )}
//                         <label htmlFor={option.id}>
//                           {option.name} 
//                           <span className={styles.optionCount}>({option.count})</span>
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Кнопка сброса фильтров */}
//           <button className={styles.resetButton} onClick={resetFilters}>
//             Сбросить фильтр
//           </button>
          
//           {/* Отладочная информация */}
//         </div>

//         {/* Сетка продуктов */}
//         <div className={styles.productGrid}>
//           {loading ? (
//             <div className={styles.loading}>Загрузка...</div>
//           ) : filteredVariants.length === 0 ? (
//             <div className={styles.noResults}>Нет товаров, соответствующих выбранным фильтрам</div>
//           ) : (
//             filteredVariants.map(({ product, variant }, index) => (
//               <div key={`variant-${index}`} className={styles.productCardWrapper}>
//                 <ProductCard 
//                   product={{
//                     ...product,
//                     variants: [variant]
//                   }} 
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





















//                      ВЕРСИЯ НА ПОКАЗ















'use client';
// src/components/CatalogPage.tsx
import React, { useState, useEffect } from 'react';
import styles from './CatalogPage.module.scss';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

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
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
  handle: string;
}

interface CatalogPageProps {
  category: Category;
  products: Product[];
  breadcrumbs?: { name: string; path: string }[];
}

export default function CatalogPage({ category, products = [], breadcrumbs = [] }: CatalogPageProps) {
  // Состояния
  const [filteredVariants, setFilteredVariants] = useState<{product: Product, variant: ProductVariant}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ценовой диапазон
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 100000]);
  
  // Фильтры (фиксированные категории)
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [memoryOptions, setMemoryOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  
  // Выбранные фильтры
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Состояние развернутости фильтров
  const [expandedFilters, setExpandedFilters] = useState({
    'price': true,
    'color': true,
    'memory': true,
    'size': true
  });
  
  // Первоначальная инициализация данных
  useEffect(() => {
    if (products.length > 0) {
      console.log("Инициализация с", products.length, "товарами");
      // Собираем все варианты всех продуктов
      const allVariants = products.flatMap(product => 
        (product.variants || []).map(variant => ({ product, variant }))
      );
      
      // Устанавливаем варианты
      setFilteredVariants(allVariants);
      
      // Извлекаем цены
      extractPriceRange(allVariants);
      
      // Извлекаем опции
      extractFilterOptions(allVariants);
      
      setLoading(false);
    }
  }, [products]);
  
  // Извлечение ценового диапазона
  const extractPriceRange = (variants: {product: Product, variant: ProductVariant}[]) => {
    try {
      const prices: number[] = [];
      
      variants.forEach(({ variant }) => {
        if (!variant.prices) return;
        
        variant.prices.forEach(price => {
          if (price && typeof price.amount === 'number') {
            prices.push(price.amount / 100);
          }
        });
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
  
  // Извлечение опций для фильтров
  const extractFilterOptions = (variants: {product: Product, variant: ProductVariant}[]) => {
    try {
      // Множества для хранения уникальных значений
      const colors = new Set<string>();
      const memories = new Set<string>();
      const sizes = new Set<string>();
      
      // Проверяем каждый вариант
      variants.forEach(({ variant }) => {
        if (!variant.title) return;
        
        const title = variant.title.toLowerCase();
        
        // Ищем цвета
        const colorKeywords = [
          'black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 
          'pink', 'gold', 'silver', 'graphite', 'gray', 'space gray', 
          'midnight', 'starlight', 'product red'
        ];
        
        for (const color of colorKeywords) {
          if (title.includes(color)) {
            colors.add(color.charAt(0).toUpperCase() + color.slice(1)); // Capitalize
            break;
          }
        }
        
        // Ищем объем памяти
        const memoryMatch = title.match(/(\d+)(gb|tb)/i);
        if (memoryMatch && memoryMatch[1] && memoryMatch[2]) {
          memories.add(`${memoryMatch[1]}${memoryMatch[2].toUpperCase()}`);
        }
        
        // Ищем размеры
        const sizeMatch = title.match(/\b(size|размер)?\s*(\d+|xs|s|m|l|xl|xxl|xxxl)\b/i);
        if (sizeMatch && sizeMatch[2]) {
          sizes.add(sizeMatch[2].toUpperCase());
        }
      });
      
      // Устанавливаем опции фильтров
      setColorOptions(Array.from(colors).sort());
      setMemoryOptions(Array.from(memories).sort());
      setSizeOptions(Array.from(sizes).sort());
      
      console.log("Извлечены опции фильтров:", {
        colors: Array.from(colors),
        memories: Array.from(memories),
        sizes: Array.from(sizes)
      });
    } catch (error) {
      console.error("Ошибка при извлечении опций фильтров:", error);
    }
  };
  
  // Применение фильтров
  useEffect(() => {
    if (products.length === 0) return;
    
    setLoading(true);
    
    try {
      // Собираем все варианты всех продуктов
      let filteredItems = products.flatMap(product => 
        (product.variants || []).map(variant => ({ product, variant }))
      );
      
      // Фильтр по цене
      filteredItems = filteredItems.filter(({ variant }) => {
        if (!variant.prices || variant.prices.length === 0) return true;
        
        return variant.prices.some(price => {
          if (!price || typeof price.amount !== 'number') return true;
          
          const priceValue = price.amount / 100;
          return priceValue >= currentPriceRange[0] && priceValue <= currentPriceRange[1];
        });
      });
      
      // Фильтр по цвету
      if (selectedColors.length > 0) {
        filteredItems = filteredItems.filter(({ variant }) => {
          if (!variant.title) return false;
          
          const title = variant.title.toLowerCase();
          return selectedColors.some(color => title.includes(color.toLowerCase()));
        });
      }
      
      // Фильтр по памяти
      if (selectedMemories.length > 0) {
        filteredItems = filteredItems.filter(({ variant }) => {
          if (!variant.title) return false;
          
          const title = variant.title.toLowerCase();
          return selectedMemories.some(memory => title.toLowerCase().includes(memory.toLowerCase()));
        });
      }
      
      // Фильтр по размеру
      if (selectedSizes.length > 0) {
        filteredItems = filteredItems.filter(({ variant }) => {
          if (!variant.title) return false;
          
          const title = variant.title.toLowerCase();
          return selectedSizes.some(size => {
            // Ищем размер как отдельное слово
            const regex = new RegExp(`\\b${size.toLowerCase()}\\b`, 'i');
            return regex.test(title);
          });
        });
      }
      
      console.log(`Отфильтровано ${filteredItems.length} вариантов`);
      setFilteredVariants(filteredItems);
    } catch (error) {
      console.error("Ошибка при применении фильтров:", error);
      // В случае ошибки показываем все варианты
      const allVariants = products.flatMap(product => 
        (product.variants || []).map(variant => ({ product, variant }))
      );
      setFilteredVariants(allVariants);
    } finally {
      setLoading(false);
    }
  }, [products, currentPriceRange, selectedColors, selectedMemories, selectedSizes]);
  
  // Обработчики изменения чекбоксов
  const handleColorChange = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };
  
  const handleMemoryChange = (memory: string) => {
    setSelectedMemories(prev => {
      if (prev.includes(memory)) {
        return prev.filter(m => m !== memory);
      } else {
        return [...prev, memory];
      }
    });
  };
  
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedMemories([]);
    setSelectedSizes([]);
    setCurrentPriceRange(priceRange);
  };
  
  // Переключение развернутости фильтра
  const toggleFilterGroup = (filterName: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  // Обработчик изменения ценового диапазона
  const handlePriceRangeChange = (min: number, max: number) => {
    setCurrentPriceRange([min, max]);
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

  return (
    <div className={styles.catalogContainer}>
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
      <h1 className={styles.categoryTitle}>{category?.name || 'Категория'}</h1>

      <div className={styles.catalogContent}>
        {/* Сайдбар с фильтрами */}
        <div className={styles.filterSidebar}>
          {/* Фильтр по цене */}
          <div className={styles.filterGroup}>
            <div 
              className={styles.filterHeader} 
              onClick={() => toggleFilterGroup('price')}
            >
              <h3>Цена</h3>
              <span className={styles.collapseIcon}>
                {expandedFilters['price'] ? '▲' : '▼'}
              </span>
            </div>
            
            {expandedFilters['price'] && (
              <div className={styles.priceRange}>
                <div className={styles.rangeValues}>
                  <span>{currentPriceRange[0]} ₴</span>
                  <span>{currentPriceRange[1]} ₴</span>
                </div>
                <div className={styles.rangeSliders}>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={currentPriceRange[0]}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), currentPriceRange[1])}
                    className={styles.rangeSlider}
                  />
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
            )}
          </div>
          
          {/* Фильтр по цвету */}
          {colorOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup('color')}
              >
                <h3>Цвет</h3>
                <span className={styles.collapseIcon}>
                  {expandedFilters['color'] ? '▲' : '▼'}
                </span>
              </div>
              
              {expandedFilters['color'] && (
                <div className={styles.filterContent}>
                  <div className={styles.filterOptions}>
                    {colorOptions.map((color, index) => (
                      <div key={`color-${index}`} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          id={`color-${index}`}
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorChange(color)}
                        />
                        <span 
                          className={styles.colorSquare}
                          style={{ backgroundColor: getColorCode(color) }}
                        />
                        <label htmlFor={`color-${index}`}>{color}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Фильтр по памяти */}
          {memoryOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup('memory')}
              >
                <h3>Память</h3>
                <span className={styles.collapseIcon}>
                  {expandedFilters['memory'] ? '▲' : '▼'}
                </span>
              </div>
              
              {expandedFilters['memory'] && (
                <div className={styles.filterContent}>
                  <div className={styles.filterOptions}>
                    {memoryOptions.map((memory, index) => (
                      <div key={`memory-${index}`} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          id={`memory-${index}`}
                          checked={selectedMemories.includes(memory)}
                          onChange={() => handleMemoryChange(memory)}
                        />
                        <label htmlFor={`memory-${index}`}>{memory}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Фильтр по размеру */}
          {sizeOptions.length > 0 && (
            <div className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup('size')}
              >
                <h3>Размер</h3>
                <span className={styles.collapseIcon}>
                  {expandedFilters['size'] ? '▲' : '▼'}
                </span>
              </div>
              
              {expandedFilters['size'] && (
                <div className={styles.filterContent}>
                  <div className={styles.filterOptions}>
                    {sizeOptions.map((size, index) => (
                      <div key={`size-${index}`} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          id={`size-${index}`}
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />
                        <label htmlFor={`size-${index}`}>{size}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Кнопка сброса фильтров */}
          <button className={styles.resetButton} onClick={resetFilters}>
            Сбросить фильтр
          </button>
          
          {/* Отладочная информация */}
          <div style={{ padding: '10px', fontSize: '12px', color: '#999', marginTop: '10px' }}>
            <p>Всего вариантов: {filteredVariants.length}</p>
            <p>Выбрано цветов: {selectedColors.length}</p>
            <p>Выбрано объемов памяти: {selectedMemories.length}</p>
            <p>Выбрано размеров: {selectedSizes.length}</p>
          </div>
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
                    variants: [variant]
                  }} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}