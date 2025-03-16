// src/components/ProductCard.tsx
import { useState } from "react";
import Link from "next/link";
import styles from "./product.card.module.scss";

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

const ProductCard = ({ product }: { product: Product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Функция форматирования цены
  const formatPrice = (amount: number): string => {
    return (amount / 100).toLocaleString() + ' ₴';
  };

  // Получаем все варианты для этого продукта
  const variants = product.variants || [];
  
  // Если нет вариантов, просто отображаем один товар
  if (variants.length === 0) {
    return renderSingleCard(product, null, selectedIndex, setSelectedIndex);
  }
  
  // Отображаем карточки для каждого варианта
  return (
    <>
      {variants.map((variant) => (
        renderSingleCard(product, variant, selectedIndex, setSelectedIndex)
      ))}
    </>
  );
};

// Функция для рендера одной карточки товара
const renderSingleCard = (
  product: Product, 
  variant: ProductVariant | null, 
  selectedIndex: number, 
  setSelectedIndex: (index: number) => void
) => {
  // Получаем цену из варианта или из первого варианта, если вариант не указан
  const price = variant?.prices?.[0]?.amount || product.variants?.[0]?.prices?.[0]?.amount || 0;
  
  // Получаем название варианта
  const variantTitle = variant?.title || '';
  
  return (
    <div key={variant?.id || product.id} className={styles.card}>
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
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Информация о товаре */}
      <div className={styles.details}>
        {/* Рейтинг */}
        <div className={styles.rating}>
          <span>⭐⭐⭐⭐⭐ (27)</span>
        </div>
        
        {/* Название товара */}
        <h2 className={styles.title}>{product.title}</h2>
        
        {/* Название варианта (если есть) */}
        {variantTitle && (
          <p className={styles.variantTitle}>{variantTitle}</p>
        )}
        
        {/* Секция покупки с ценой */}
        <div className={styles.buySection}>
          <Link href={`/product/${product.handle}`}>
            <button className={styles.buyButton}>Купить</button>
          </Link>
          <span className={styles.price}>
            {/* снизу прайс должен быть в функции формат прайс , но ее не существует , поэтому 50000 грн*/}
            {price > 0 ? price : '50 000 грн'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;