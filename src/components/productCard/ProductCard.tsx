import { useCart } from "@/context/CartContext";
import { useOverlay } from "@/context/OverlayContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./product.card.module.scss";
import { RatingStarIcon } from "@/assets/icons/icons";
import { localStorageService } from "@/services/localStorage";

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
  color?: string; 
  [key: string]: any;
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options?: any[];
}

const extractColors = (product: Product): string[] => {
  const colors: Set<string> = new Set();
  
  if (product.options && Array.isArray(product.options)) {
    const colorOption = product.options.find(option => 
      option.title && option.title.toLowerCase() === 'color' || 
      option.title && option.title.toLowerCase() === 'колір' || 
      option.title && option.title.toLowerCase() === 'цвет'
    );
    
    if (colorOption && Array.isArray(colorOption.values)) {
      colorOption.values.forEach((value: any) => {
        if (typeof value === 'string') {
          colors.add(value);
        } else if (value && typeof value.value === 'string') {
          colors.add(value.value);
        }
      });
    }
  }
  
  if (colors.size === 0 && product.variants && Array.isArray(product.variants)) {
    product.variants.forEach(variant => {
      if (variant.color) {
        colors.add(variant.color);
      }
      
      if (variant.title) {
        const titleParts = variant.title.split(' / ');
        if (titleParts.length > 0) {
          colors.add(titleParts[0]); 
        }
      }
      
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

const getColorCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'yellow': '#ffff00',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'gold': '#ffd700',
    'silver': '#c0c0c0',
    'graphite': '#333333',
    'gray': '#808080',
    'space gray': '#676767',
    'midnight': '#121212',
    'starlight': '#f9f3ee',
    'product red': '#ff0000',
    'desert titanium': '#d5c4b0',
    'natural titanium': '#c0bcb1',
    'black titanium': '#232323',
    'white titanium': '#e8e8e8',
  };
  
  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || '#cccccc';
};

const ProductCard = ({ product }: { product: Product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const formatPrice = (amount: number): string => {
    return (amount / 100).toLocaleString() + ' ₴';
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
  const router = useRouter();
  const { openCart } = useCart();
  const { showOverlay } = useOverlay();
  
  const price = variant?.prices?.[0]?.amount || product.variants?.[0]?.prices?.[0]?.amount || 0;
  
  const variantTitle = variant?.title || '';
  
  const colors = extractColors(product);
  
  const handleBuy = () => {
    localStorageService({method: 'set', key: 'cart', value: JSON.stringify(product)});
    showOverlay();
    openCart();
  };

  return (
    <div onClick={() => router.push(`/product/${product.handle}`)} key={variant?.id || product.id} className={styles.card}>
      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[selectedIndex]?.url}
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>Нет фото</div>
        )}
      </div>
      {/* Индикаторы изображений (точки) */}
      {product.images && product.images.length > 1 && (
        <div className={styles.indicators}>
          {product.images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${selectedIndex === index ? styles.active : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(index);
              }}
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

        {/* Название товара */}
        <h2 className={styles.title}>{product.title} {variantTitle !== 'Default variant' && variantTitle}</h2> 
    
        {/* Секция покупки с ценой */}
        <div className={styles.buySection}>
          <button type="button" onClick={(event) => {
            event.stopPropagation();
            handleBuy();
        }} className={styles.buyButton}>Купити</button>
          <span className={styles.price}>
            {price > 0 ? (formatPrice(price)) : '50 000 ₴'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;