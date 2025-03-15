'use client';

import React, { useState, useEffect } from 'react';
import styles from './ProductFilterPage.module.scss';
import ProductCard from './ProductCard';
import { medusa } from '@/lib/medusa';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  handle: string;
  rating: number;
  reviewCount: number;
  specs: {
    [key: string]: any;
  };
}

interface ProductsListResponse {
  products: Product[]; // массив продуктов
}

interface ProductFilterPageProps {
  tag: string;
}

export const ProductFilterPage: React.FC<ProductFilterPageProps> = ({ tag }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 0]);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (tag) {
      fetchProducts(tag);
    }
  }, [tag]);

  const fetchProducts = async (tag: string) => {
    setLoading(true);
    try {
      // Fetch products from Medusa API
      const prods: ProductsListResponse = await medusa.products.list({
        tags: [tag],
      });

      setProducts(prods.products);
      setFilteredProducts(prods.products);

      // Set initial price range
      if (prods.products.length > 0) {
        const prices = prods.products.map((p: Product) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setCurrentPriceRange([minPrice, maxPrice]);
      }

      // Generate dynamic filters
      generateFilters(prods.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateFilters = (products: Product[]) => {
    const filterData: { [key: string]: Set<string> } = {};

    products.forEach((product) => {
      // Extract all possible filter values from product specs
      Object.entries(product.specs).forEach(([key, value]) => {
        if (!filterData[key]) {
          filterData[key] = new Set();
        }
        filterData[key].add(value.toString());
      });
    });

    // Convert Sets to arrays for rendering
    const filtersObject: { [key: string]: string[] } = {};
    Object.entries(filterData).forEach(([key, values]) => {
      filtersObject[key] = Array.from(values);
    });

    setFilters(filtersObject);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (!newFilters[filterType]) {
        newFilters[filterType] = [value];
      } else {
        const valueIndex = newFilters[filterType].indexOf(value);
        if (valueIndex === -1) {
          newFilters[filterType].push(value);
        } else {
          newFilters[filterType].splice(valueIndex, 1);
          if (newFilters[filterType].length === 0) {
            delete newFilters[filterType];
          }
        }
      }

      return newFilters;
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setCurrentPriceRange([min, max]);
  };

  const applyFilters = () => {
    let result = [...products];

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= currentPriceRange[0] && product.price <= currentPriceRange[1]
    );

    // Apply other filters
    Object.entries(activeFilters).forEach(([filterType, values]) => {
      if (values.length > 0) {
        result = result.filter((product) =>
          values.includes(product.specs[filterType]?.toString() || '')
        );
      }
    });

    setFilteredProducts(result);
  };

  const resetFilters = () => {
    setActiveFilters({});
    setCurrentPriceRange(priceRange);
    setFilteredProducts(products);
  };

  useEffect(() => {
    applyFilters();
  }, [activeFilters, currentPriceRange]);

  // Helper function to generate filter options UI
  const renderFilterOptions = (filterType: string, values: string[]) => {
    // For color filters
    if (filterType.toLowerCase().includes('цвет')) {
      return (
        <div className={styles.colorFilter}>
          {values.map((value) => (
            <div
              key={value}
              className={`${styles.colorOption} ${activeFilters[filterType]?.includes(value) ? styles.selected : ''}`}
              style={{ backgroundColor: value.toLowerCase() }}
              onClick={() => handleFilterChange(filterType, value)}
              title={value}
            />
          ))}
        </div>
      );
    }

    // For screen size filters
    if (filterType.toLowerCase().includes('диагональ') || filterType.toLowerCase().includes('экран')) {
      return (
        <div className={styles.screenSizeFilter}>
          {values.map((value) => (
            <div
              key={value}
              className={`${styles.sizeOption} ${activeFilters[filterType]?.includes(value) ? styles.selected : ''}`}
              onClick={() => handleFilterChange(filterType, value)}
            >
              {value}
            </div>
          ))}
        </div>
      );
    }

    // Default checkbox filter
    return (
      <div className={styles.filterOptions}>
        {values.map((value) => (
          <div key={value} className={styles.filterOption}>
            <input
              type="checkbox"
              id={`${filterType}-${value}`}
              checked={activeFilters[filterType]?.includes(value) || false}
              onChange={() => handleFilterChange(filterType, value)}
            />
            <label htmlFor={`${filterType}-${value}`}>{value}</label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterSidebar}>
        <div className={styles.filterGroup}>
          <div className={styles.filterHeader}>
            <h3>Цена от и до</h3>
            <span className={styles.collapseIcon}>▲</span>
          </div>
          <div className={styles.priceRange}>
            <span>{currentPriceRange[0]}</span>
            <span>{currentPriceRange[1]}</span>
          </div>
          <div className={styles.priceRangeSlider}>
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={currentPriceRange[0]}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value), currentPriceRange[1])}
            />
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={currentPriceRange[1]}
              onChange={(e) => handlePriceRangeChange(currentPriceRange[0], Number(e.target.value))}
            />
          </div>
        </div>

        {/* Dynamic filters */}
        {Object.entries(filters).map(([filterType, values]) => (
          <div key={filterType} className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <h3>{filterType}</h3>
              <span className={styles.collapseIcon}>▲</span>
            </div>
            {renderFilterOptions(filterType, values)}
          </div>
        ))}

        <button className={styles.resetButton} onClick={resetFilters}>
          Сбросить фильтр
        </button>
      </div>

      <div className={styles.productGrid}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.noResults}>Нет товаров, соответствующих фильтрам</div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
