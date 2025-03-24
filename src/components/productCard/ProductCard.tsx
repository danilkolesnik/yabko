import { useCart } from "@/context/CartContext";
import { useOverlay } from "@/context/OverlayContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./product.card.module.scss";
import { RatingStarIcon } from "@/assets/icons/icons";
import { localStorageService } from "@/services/localStorage";
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

const ProductCard = ({ product, isSlider }: { product: Product, isSlider: boolean }) => {

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
      {!isSlider ? variants.map((variant) => (
        renderSingleCard(product, variant, selectedIndex, setSelectedIndex, formatPrice)
      )) : (
        renderProduct(product, selectedIndex, setSelectedIndex, formatPrice)
      )}
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

  const productImages : ProductImage[] = product.images;

  const handle: string = variant?.metadata?.handle;
  const variantImages: string[] = variant?.metadata?.img?.split(",").map((url : any) => url.trim());

  const handleBuy = () => {
    localStorageService({method: 'set', key: 'cart', value: JSON.stringify(product)});
    showOverlay();
    openCart();
  };

  return (
    <div onClick={() => router.push(`${variant?.metadata?.handle}`)} key={variant?.id || product.id} className={styles.card}>
      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        {variantImages && variantImages.length > 0 ? (
          <img
            src={variantImages[selectedIndex]}
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <img
            src={productImages[selectedIndex].url}
            alt={product.title}
            className={styles.productImage}
          />
        )}
      </div>
      {/* Индикаторы изображений (точки) */}
      {variantImages && variantImages.length > 1 && (
        <div className={styles.indicators}>
          {variantImages.map((_, index) => (
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
        <h2 className={styles.title}>{variant.title}</h2> 
    
        {/* Секция покупки с ценой */}
        <div className={styles.buySection}>
          <button type="button" onClick={(event) => {
            event.stopPropagation();
            handleBuy();
        }} className={styles.buyButton}>Купити</button>
          <span className={styles.price}>
            {variant?.metadata?.price > 0 ? (formatPrice(variant?.metadata?.price)) : '50530 ₴'}
          </span>
        </div>
      </div>
    </div>
  );
};

const renderProduct = (
  product: Product,
  selectedIndex: number, 
  setSelectedIndex: (index: number) => void,
  formatPrice: (amount: number) => string,
) => {
  const router = useRouter();
  const { openCart } = useCart();
  const { showOverlay } = useOverlay();

  const price = product?.variants[0].metadata?.price || 0;
  
  const productTitle = product?.title || '';
  
  const colors = extractColors(product);
  
  const handle: string = product?.variants[0]?.metadata?.handle;
  const productImages : ProductImage[] = product.images;

  const handleBuy = () => {
    localStorageService({method: 'set', key: 'cart', value: JSON.stringify(product)});
    showOverlay();
    openCart();
  };

  return (
    <div onClick={() => router.push(`${product?.variants[0]?.metadata?.handle}`)} key={product?.variants[0]?.id || product.id} className={styles.card}>
      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        {productImages && productImages.length > 0 ? (
          <img
            src={productImages[selectedIndex].url}
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>Нет фото</div>
        )}
      </div>
      {/* Индикаторы изображений (точки) */}
      {productImages && productImages.length > 1 && (
        <div className={styles.indicators}>
          {productImages.map((_, index) => (
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
        <h2 className={styles.title}>{product.title}</h2> 
    
        {/* Секция покупки с ценой */}
        <div className={styles.buySection}>
          <button type="button" onClick={(event) => {
            event.stopPropagation();
            handleBuy();
        }} className={styles.buyButton}>Купити</button>
          <span className={styles.price}>
            {product?.variants[0].metadata?.price > 0 ? (formatPrice(product?.variants[0]?.metadata?.price)) : '50530 ₴'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;