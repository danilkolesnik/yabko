// src/components/ProductCard.tsx
import { useState } from "react";
import Link from "next/link";
import styles from "./product.card.module.scss";
import { RatingStarIcon } from "@/assets/icons/icons";
import { getColorCode } from "@/utils/constants";

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
  color?: string; // Add color property
  [key: string]: any; // To accommodate any other variant properties
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options?: any[]; // Add options array from CatalogPage
}

// Function to extract colors from product variants - similar to the function in CatalogPage
const extractColors = (product: Product): string[] => {
  const colors: Set<string> = new Set();
  
  // First try to get colors from product options
  if (product.options && Array.isArray(product.options)) {
    const colorOption = product.options.find(option => 
      option.title && option.title.toLowerCase() === 'color' || 
      option.title && option.title.toLowerCase() === 'колір' || 
      option.title && option.title.toLowerCase() === 'цвет'
    );
    
    if (colorOption && Array.isArray(colorOption.values)) {
      colorOption.values.forEach(value => {
        if (typeof value === 'string') {
          colors.add(value);
        } else if (value && typeof value.value === 'string') {
          colors.add(value.value);
        }
      });
    }
  }
  
  // If no colors found in options, try to extract from variants
  if (colors.size === 0 && product.variants && Array.isArray(product.variants)) {
    product.variants.forEach(variant => {
      // Check direct color property
      if (variant.color) {
        colors.add(variant.color);
      }
      
      // Check title for color (common pattern is "Color / Size")
      if (variant.title) {
        const titleParts = variant.title.split(' / ');
        if (titleParts.length > 0) {
          colors.add(titleParts[0]); // First part is often color
        }
      }
      
      // Check options array if exists
      if (variant.options && Array.isArray(variant.options)) {
        variant.options.forEach(opt => {
          if (
            (opt.option && opt.option.title && 
             (opt.option.title.toLowerCase() === 'color' || 
              opt.option.title.toLowerCase() === 'колір' || 
              opt.option.title.toLowerCase() === 'цвет') && 
             opt.value) ||
            (opt.color)
          ) {
            colors.add(opt.value || opt.color);
          }
        });
      }
    });
  }
  
  return Array.from(colors);
};


const ProductCard = ({ product }: { product: Product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const formatPrice = (amount: number): string => {
    return amount.toLocaleString() + ' ₴';
  };

  const variants = product.variants || [];
  
  if (variants.length === 0) {
    return renderSingleCard(product, null, selectedIndex, setSelectedIndex, formatPrice);
  }
  
  return (
    <>
      {variants.map((variant) => (
        renderSingleCard(product, variant, selectedIndex, setSelectedIndex, formatPrice)
        
      ))}
    </>
  );
};

const renderSingleCard = (
  product: Product, 
  variant: ProductVariant | null, 
  selectedIndex: number, 
  setSelectedIndex: (index: number) => void,
  formatPrice: (amount: number) => string,
) => {
  const price = variant?.prices?.[0]?.amount || product.variants?.[0]?.prices?.[0]?.amount || 0;
  
  const variantTitle = variant?.title || '';
  
  // Extract colors for this product
  const colors = extractColors(product);
  console.log(variant)

  const handle: string = variant?.metadata?.handle;
  const variantImages: string[] = variant?.metadata?.img?.split(",").map(url   => url.trim());
  console.log(variantImages)

  
  return (
    <div key={variant?.id || product.id} className={styles.card}>
      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        {/* {product.images && product.images.length > 0 ? (
          <img
            src={product.images[selectedIndex]?.url}
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>Нет фото</div>
        )} */}
        {variantImages && variantImages.length > 0 ? (
          <img
            src={variantImages[selectedIndex]}
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>Нет фото</div>
        )}
      </div>

      {/* Индикаторы изображений (точки) */}
      {variantImages && variantImages.length > 1 && (
        <div className={styles.indicators}>
          {variantImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${selectedIndex === index ? styles.active : ""}`}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Информация о товаре */}
      <div className={styles.details}>
        {/* Рейтинг */}
        <div className={styles.rating}>
          <span>{[1,2,3,4,5].map((star) => <RatingStarIcon key={star} />)}</span>
          <span className={styles.reviewCount}>(40)</span>
        </div>
        
        {/* Color circles - NEW */}
        {colors.length > 0 && (
          <div className={styles.colorOptions}>
            {colors.map((color, index) => (
              <span 
                key={index} 
                className={styles.colorOption} 
                style={{ backgroundColor: getColorCode(color) }}
                title={color}
              />
            ))}
          </div>
        )}
        
        {/* Название варианта (если есть) */}
        {variantTitle && (
          <p className={styles.title}>{variantTitle}</p>
        )}
        {/* Название товара */}
        {!variantTitle && (
          <h2 className={styles.title}>{product.title}</h2> 
        )}
        
        {/* Секция покупки с ценой */}
        <div className={styles.buySection}>
          {handle ? (
            <Link href={handle}>
              <button className={styles.buyButton}>Купить</button>
            </Link>
          ) : (
            <Link href={product.handle}>
              <button className={styles.buyButton}>no handle on variant metadata</button>
            </Link>
          )}
          
          <span className={styles.price}>
            {variant?.metadata?.price > 0 ? (formatPrice(variant?.metadata?.price)) : 'nothing'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;