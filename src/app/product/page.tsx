// app/product/[id]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.scss';

interface ProductOption {
  id: string;
  label: string;
  selected?: boolean;
}

interface ProductColor {
  id: string;
  name: string;
  colorClass: string;
}

interface ProductWarranty {
  id: string;
  name: string;
  price: number;
}

const ProductPage = () => {
  // Состояния для выбранных опций
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState('Global');
  const [selectedCondition, setSelectedCondition] = useState('Новий');
  const [selectedStorage, setSelectedStorage] = useState('512GB');
  const [selectedSeries, setSelectedSeries] = useState('iPhone 15 Pro Max');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedWarranty, setSelectedWarranty] = useState('2');

  // Данные продукта
  const productImages = [
    '/images/iphone15-main.jpg',
    '/images/iphone15-side.jpg',
    '/images/iphone15-camera.jpg',
    '/images/iphone15-profile.jpg',
    '/images/iphone15-front.jpg',
  ];

  const versionOptions: ProductOption[] = [
    { id: 'global', label: 'Global' },
    { id: 'esim', label: 'E-SIM' },
  ];

  const conditionOptions: ProductOption[] = [
    { id: 'new', label: 'Новий' },
    { id: 'bu', label: 'Б/У' },
  ];

  const storageOptions: ProductOption[] = [
    { id: '256', label: '256GB' },
    { id: '512', label: '512GB' },
    { id: '1tb', label: '1TB' },
  ];

  const seriesOptions: ProductOption[] = [
    { id: 'iphone15pro', label: 'iPhone 15 Pro' },
    { id: 'iphone15promax', label: 'iPhone 15 Pro Max' },
  ];

  const colorOptions: ProductColor[] = [
    { id: 'gray', name: 'Титановый серый', colorClass: styles.colorGray },
    { id: 'white', name: 'Титановый белый', colorClass: styles.colorWhite },
    { id: 'gold', name: 'Титановый золотой', colorClass: styles.colorGold },
    { id: 'blue', name: 'Титановый синий', colorClass: styles.colorBlue },
  ];

  const warrantyOptions: ProductWarranty[] = [
    { id: '1', name: 'Гарантія 1 рік', price: 2549 },
    { id: '2', name: 'Гарантія 2 роки', price: 4199 },
  ];

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.navigation}>
          <ul className={styles.navTabs}>
            <li className={styles.navItem}>Аксесуари</li>
            <li className={styles.navItem}>Опис</li>
            <li className={styles.navItem}>Характеристики</li>
            <li className={styles.navItem}>Відгуки (54)</li>
            <li className={styles.navItem}>Порівняння</li>
          </ul>
          <div className={styles.articleNumber}>Артикул: MU7F3</div>
        </nav>
      </header>

      <div className={styles.productContainer}>
        <div className={styles.productImageSection}>
          <div className={styles.mainImageContainer}>
            <Image 
              src="/iphone.jpg" 
              alt="iPhone 15 Pro Max Blue Titanium" 
              className={styles.mainImage}
              width={400}
              height={500}
              priority
            />
          </div>

          <div className={styles.thumbnails}>
            {productImages.map((img, index) => (
              <div 
                key={index}
                className={`${styles.thumbnail} ${activeImageIndex === index ? styles.activeThumbnail : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`} 
                  width={60}
                  height={60}
                />
              </div>
            ))}
          </div>

          
        </div>
        
        <div className={styles.productDetails}>
          <div className={styles.header}>
            <h1 className={styles.productTitle}>Apple iPhone 15 Pro Max 512GB (Blue Titanium)</h1>
          
            <div className={styles.rating}>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.reviewCount}>(54)</span>
            </div>
            
            <div className={styles.pricing}>
              <span className={styles.currentPrice}>56 699 грн</span>
              <span className={styles.oldPrice}>60 878 грн</span>
            </div>
            
            <div className={styles.productCode}>Код товару: 814883</div>
          </div>
          
          
          <div className={styles.paymentOptions}>
            <div className={styles.paymentOption}>
              <div className={styles.paymentIcon}>📱</div>
              <span>Оплата Частинами</span>
            </div>
            <div className={styles.paymentOption}>
              <div className={styles.paymentIcon}>🚚</div>
              <span>Безкоштовна доставка</span>
            </div>
            <div className={styles.paymentOption}>
              <div className={styles.paymentIcon}>🔄</div>
              <span>Вигідний TRADE-IN</span>
            </div>
          </div>
          
          <div className={styles.productSpecs}>
            <div className={styles.specRow}>
              <div className={styles.specGroup}>
                <div className={styles.specTitle}>
                Версія: <span className={styles.infoIcon}>ⓘ</span>
                </div>
                <div className={styles.specOptions}>
                  {versionOptions.map(option => (
                    <button
                      key={option.id}
                      className={`${styles.optionBtn} ${selectedVersion === option.label ? styles.optionBtnActive : ''}`}
                      onClick={() => setSelectedVersion(option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.specGroup}>
                <div className={styles.specTitle}>Стан товару:</div>
                <div className={styles.specOptions}>
                  {conditionOptions.map(option => (
                    <button
                      key={option.id}
                      className={`${styles.optionBtn} ${selectedCondition === option.label ? styles.optionBtnActive : ''}`}
                      onClick={() => setSelectedCondition(option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            
            
            <div className={styles.specRow}>
              <div className={styles.specTitle}>Об'єм пам'яті:</div>
              <div className={styles.specOptions}>
                {storageOptions.map(option => (
                  <button
                    key={option.id}
                    className={`${styles.optionBtn} ${selectedStorage === option.label ? styles.optionBtnActive : ''}`}
                    onClick={() => setSelectedStorage(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.specRow}>
              <div className={styles.specTitle}>Серія:</div>
              <div className={styles.specOptions}>
                {seriesOptions.map(option => (
                  <button
                    key={option.id}
                    className={`${styles.optionBtn} ${selectedSeries === option.label ? styles.optionBtnActive : ''}`}
                    onClick={() => setSelectedSeries(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.specRow}>
              <div className={styles.specTitle}>Колір пристрою:</div>
              <div className={styles.colorOptions}>
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    className={`${styles.colorBtn} ${selectedColor === color.id ? styles.colorBtnActive : ''} ${color.colorClass}`}
                    onClick={() => setSelectedColor(color.id)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className={styles.specRow}>
              <div className={styles.specTitle}>Рекомендуємо до покупки:</div>
              <div className={styles.warrantyOptions}>
                {warrantyOptions.map(warranty => (
                  <div key={warranty.id} className={styles.warrantyOption}>
                    <label className={styles.checkboxLabel}>
                      <div className={styles.switchWrapper}>
                        <input
                          type="checkbox"
                          checked={selectedWarranty === warranty.id}
                          onChange={() => setSelectedWarranty(warranty.id)}
                          className={styles.checkbox}
                        />
                        <span className={styles.switchSlider}></span>
                      </div>
                      <span className={styles.checkboxText}>{warranty.name}</span>
                    </label>
                    <span className={styles.warrantyPrice}>від {warranty.price} грн</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button className={styles.preorderBtn}>Передзамовлення</button>
          
          <div className={styles.specRow}>
            <div className={styles.warrantyInfo}>
              <h3 className={styles.warrantyTitle}>Гарантія та доставка:</h3>
              <div className={styles.warrantyItem}>
                <span className={styles.warrantyIcon}>🚚</span>
                <span className={styles.warrantyText}>Безкоштовна доставка у магазин та відділення Нової Пошти.</span>
                <span className={styles.infoIcon}>ⓘ</span>
              </div>
              <div className={styles.warrantyItem}>
                <span className={styles.warrantyIcon}>🛡️</span>
                <span className={styles.warrantyText}>Гарантiя вiд виробника та магазину до 2 років.</span>
                <span className={styles.infoIcon}>ⓘ</span>
              </div>
              <div className={styles.warrantyItem}>
                <span className={styles.warrantyIcon}>🔄</span>
                <span className={styles.warrantyText}>Швидкий обмiн та повернення протягом 14 днiв.</span>
                <span className={styles.infoIcon}>ⓘ</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductPage;