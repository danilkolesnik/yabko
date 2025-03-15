import { useState, useEffect } from "react";
import MedusaClient from "@medusajs/medusa-js";
import styles from "./ProductCard.module.scss";
import Link from "next/link";

interface ProductImage {
  url: string;
  // Дополнительные поля изображения, если нужно
}

interface ProductVariant {
  prices: {
    amount: number;
    currency_code: string;
  }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  handle: string;
  // Здесь добавьте все поля, которые могут быть у вашего продукта
}

const ProductCard = ({product}: {product: any}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

    // Зависимость пустая, т.е. эффект выполнится только при монтировании компонента

  return (
    <div>
        <div key={product.id} className={styles.card}>
          {/* Product Image with Slider */}
          <div className={styles.imageContainer}>
            <img
              src={product.images[selectedIndex]?.url}
              alt={product.title}
              className={styles.productImage}
            />
          </div>

          {/* Dynamic Slider Dots */}
          <div className={styles.indicators}>
            {product.images.map((_: any, index: any) => (
              <span
                key={index}
                className={`${styles.dot} ${selectedIndex === index ? styles.active : ""}`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>

          {/* Product Details */}
          <div className={styles.details}>
            <div className={styles.rating}>
              <span>⭐⭐⭐⭐⭐ (27)</span>
            </div>
            <h2 className={styles.title}>{product.title}</h2>
            <p>{product.description}</p>

            <div className={styles.buySection}>
              <Link href={product.handle}><button className={styles.buyButton}>Купить</button></Link>
              <span className={styles.price}>
                {/* {product.variants[0]?.prices[0]?.amount / 100} ₴ */}
                55000 ₴ 
              </span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProductCard;
