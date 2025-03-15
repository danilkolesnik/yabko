import { useState } from "react";
import Link from "next/link";
import styles from "./ProductCard.module.scss";

const ProductCard = ({product}: {product: any}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
                {/* @ts-ignore */}
                {product.variants.prices ? product.variants[0]?.prices[0]?.amount / 100 : ''} ₴
              </span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProductCard;
