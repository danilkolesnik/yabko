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

interface ProductOptionValue {
  id?: string;
  value: string;
}

interface ProductOption {
  id?: string;
  title: string;
  values: (string | ProductOptionValue)[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options?: ProductOption[];
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

// Интерфейсы для динамических фильтров
interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
  expanded: boolean;
}

export default function CatalogPage({ category, products = [], breadcrumbs = [] }: CatalogPageProps) {
  // Состояния
  const [filteredVariants, setFilteredVariants] = useState<{product: Product, variant: ProductVariant}[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ценовой диапазон
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 100000]);
  
  // Динамические фильтры
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  
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
      
      // Извлекаем опции для динамических фильтров
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
  
  // Извлечение опций для динамических фильтров
  const extractFilterOptions = (variants: {product: Product, variant: ProductVariant}[]) => {
    try {
      // Словарь для хранения всех опций и их значений
      const optionsMap: Record<string, Set<string>> = {};
      const optionCounts: Record<string, Record<string, number>> = {};
      
      // Создаем множество для отслеживания обработанных продуктов
      const processedProducts = new Set<string>();
      
      // Для каждого варианта проверяем его продукт
      variants.forEach(({ product }) => {
        // Избегаем дублирования обработки одних и тех же продуктов
        if (processedProducts.has(product.id)) return;
        processedProducts.add(product.id);
        
        // Проверяем наличие опций у продукта
        if (product.options && Array.isArray(product.options)) {
          console.log(`Обрабатываем опции продукта ${product.id} (${product.title})`, product.options);
          
          product.options.forEach(option => {
            if (!option || !option.title || !option.values) return;
            
            // Используем оригинальное название опции
            const optionName = option.title;
            
            // Создаем запись для этой опции, если её еще нет
            if (!optionsMap[optionName]) {
              optionsMap[optionName] = new Set<string>();
              optionCounts[optionName] = {};
            }
            
            // Добавляем значения опции
            option.values.forEach(value => {
              let optionValue: string;
              
              if (typeof value === 'string') {
                optionValue = value;
              } else if (value && typeof value.value === 'string') {
                optionValue = value.value;
              } else {
                return; // Пропускаем некорректные значения
              }
              
              optionsMap[optionName].add(optionValue);
              console.log(optionsMap)
              // Увеличиваем счетчик для этого значения
              optionCounts[optionName][optionValue] = (optionCounts[optionName][optionValue] || 0) + 1;
            });
          });
        }
      });
      
      // Если не нашли опции через структуру options, подсчитываем на основе вариантов
      if (Object.keys(optionsMap).length === 0) {
        console.log("Не найдены опции в структуре товаров. Пробуем анализ вариантов...");
        
        // Создаем базовые группы для часто встречающихся типов опций
        optionsMap["Цвет"] = new Set<string>();
        optionCounts["Цвет"] = {};
        
        optionsMap["Память"] = new Set<string>();
        optionCounts["Память"] = {};
        
        optionsMap["Размер"] = new Set<string>();
        optionCounts["Размер"] = {};
        
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
              const colorValue = color.charAt(0).toUpperCase() + color.slice(1);
              optionsMap["Цвет"].add(colorValue);
              optionCounts["Цвет"][colorValue] = (optionCounts["Цвет"][colorValue] || 0) + 1;
              break;
            }
          }
          
          // Ищем объем памяти
          const memoryMatch = title.match(/(\d+)(gb|tb)/i);
          if (memoryMatch && memoryMatch[1] && memoryMatch[2]) {
            const memoryValue = `${memoryMatch[1]}${memoryMatch[2].toUpperCase()}`;
            optionsMap["Память"].add(memoryValue);
            optionCounts["Память"][memoryValue] = (optionCounts["Память"][memoryValue] || 0) + 1;
          }
          
          // Ищем размеры
          const sizeMatch = title.match(/\b(size|размер)?\s*(\d+|xs|s|m|l|xl|xxl|xxxl)\b/i);
          if (sizeMatch && sizeMatch[2]) {
            const sizeValue = sizeMatch[2].toUpperCase();
            optionsMap["Размер"].add(sizeValue);
            optionCounts["Размер"][sizeValue] = (optionCounts["Размер"][sizeValue] || 0) + 1;
          }
        });
        
        // Удаляем пустые группы
        Object.keys(optionsMap).forEach(key => {
          if (optionsMap[key].size === 0) {
            delete optionsMap[key];
            delete optionCounts[key];
          }
        });
      }
      
      // Создаем группы фильтров из найденных опций
      const dynamicFilterGroups: FilterGroup[] = Object.entries(optionsMap).map(([name, values]) => {
        const filterOptions: FilterOption[] = Array.from(values).map(value => ({
          value: value,
          label: value, // Используем оригинальное значение без преобразований
          count: optionCounts[name][value] || 0
        })).sort((a, b) => a.label.localeCompare(b.label));
        
        return {
          id: name, // Используем оригинальное название как ID
          name: name, // Используем оригинальное название как отображаемое имя
          options: filterOptions,
          expanded: true
        };
      });
      
      // Добавляем ценовой фильтр в начало списка
      const filterGroupsWithPrice: FilterGroup[] = [
        {
          id: 'price',
          name: 'Цена',
          options: [],
          expanded: true
        },
        ...dynamicFilterGroups
      ];
      
      // Устанавливаем группы фильтров
      setFilterGroups(filterGroupsWithPrice);
      
      // Инициализируем выбранные фильтры
      const initialSelectedFilters: Record<string, string[]> = {};
      filterGroupsWithPrice.forEach(group => {
        initialSelectedFilters[group.id] = [];
      });
      setSelectedFilters(initialSelectedFilters);
      
      console.log("Созданы динамические группы фильтров:", 
        dynamicFilterGroups.map(g => `${g.name} (${g.options.length} значений)`));
    } catch (error) {
      console.error("Ошибка при извлечении опций фильтров:", error);
    }
  };
  
  // Обработчик изменения чекбокса фильтра
  const handleFilterChange = (groupId: string, value: string) => {
    setSelectedFilters(prev => {
      const groupValues = [...(prev[groupId] || [])];
      
      if (groupValues.includes(value)) {
        // Удаляем значение, если оно уже выбрано
        return {
          ...prev,
          [groupId]: groupValues.filter(v => v !== value)
        };
      } else {
        // Добавляем новое значение
        return {
          ...prev,
          [groupId]: [...groupValues, value]
        };
      }
    });
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
      
      // Применяем фильтры по группам
      Object.entries(selectedFilters).forEach(([groupId, values]) => {
        if (values.length === 0 || groupId === 'price') return; // Пропускаем, если не выбраны значения или это ценовой фильтр
        
        console.log(`Применение фильтра [${groupId}] со значениями:`, values);
        
        filteredItems = filteredItems.filter(({ product, variant }) => {
          // Проверим опции продукта
          if (product.options) {
            const option = product.options.find(opt => opt.title === groupId);
            if (option) {
              return values.some(value => {
                return option.values.some(optValue => {
                  const optValueStr = typeof optValue === 'string' ? optValue : optValue.value;
                  return optValueStr === value;
                });
              });
            }
          }
          
          // Если опций нет или не найдено соответствие, проверим название варианта
          if (!variant.title) return false;
          
          const title = variant.title.toLowerCase();
          return values.some(value => title.includes(value.toLowerCase()));
        });
      });
      
      console.log(`Отфильтровано ${filteredItems.length} вариантов из общего количества`);
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
  }, [products, currentPriceRange, selectedFilters]);
  
  // Переключение развернутости фильтра
  const toggleFilterGroup = (groupId: string) => {
    setFilterGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, expanded: !group.expanded } : group
      )
    );
  };
  
  // Обработчик изменения ценового диапазона
  const handlePriceRangeChange = (min: number, max: number) => {
    setCurrentPriceRange([min, max]);
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    // Сбрасываем все выбранные фильтры
    const resetSelections: Record<string, string[]> = {};
    filterGroups.forEach(group => {
      resetSelections[group.id] = [];
    });
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
          {/* Динамические фильтры */}
          {filterGroups.map((group) => (
            <div key={group.id} className={styles.filterGroup}>
              <div 
                className={styles.filterHeader} 
                onClick={() => toggleFilterGroup(group.id)}
              >
                <h3>{group.name}</h3>
                <span className={styles.collapseIcon}>
                  {group.expanded ? '▲' : '▼'}
                </span>
              </div>
              
              {group.expanded && group.id === 'price' && (
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
              
              {group.expanded && group.id !== 'price' && (
                <div className={styles.filterContent}>
                  <div className={styles.filterOptions}>
                    {group.options.map((option) => (
                      <div key={`${group.id}-${option.value}`} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          id={`${group.id}-${option.value}`}
                          checked={selectedFilters[group.id]?.includes(option.value) || false}
                          onChange={() => handleFilterChange(group.id, option.value)}
                        />
                        {group.name.toLowerCase().includes('цвет') || group.name.toLowerCase().includes('color') && (
                          <span 
                            className={styles.colorSquare}
                            style={{ backgroundColor: getColorCode(option.value) }}
                          />
                        )}
                        <label htmlFor={`${group.id}-${option.value}`}>
                          {option.label}
                          {option.count > 0 && (
                            <span style={{ color: '#999', marginLeft: '5px' }}>({option.count})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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