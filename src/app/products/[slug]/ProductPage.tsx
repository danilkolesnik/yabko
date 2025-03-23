// app/product/[slug]/ProductPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

interface ProductPageClientProps {
  product: any;
  initialVariant: any;
}

const ProductPage = ({ product, initialVariant }: ProductPageClientProps) => {
  const router = useRouter();
  
  // State for active image, selected variant, and processed options
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [selectedWarranty, setSelectedWarranty] = useState('2');
  
  // Processed options for UI rendering
  const [processedOptions, setProcessedOptions] = useState<any[]>([]);
  
  
  // Process product options when product or selected variant changes
  useEffect(() => {
    if (!product || !product.options) return;
    
    // First, collect all currently selected option values by ID
    const currentSelections = new Map();
    
    selectedVariant.options.forEach(option => {
      currentSelections.set(option.option_id, option.value);
    });

    
    const options = product.options.map(option => {
      // Get all possible values for this option
      const availableValues = new Set();
      product.variants.forEach(variant => {
        const optionValue = variant.options.find(vo => vo.option_id === option.id);
        if (optionValue) {
          availableValues.add(optionValue.value);
        }
      });
      
      // Map to UI format
      const values = Array.from(availableValues).map(value => {
        // Check if this value is selected in current variant
        const isSelected = selectedVariant.options.some(
          vo => vo.option_id === option.id && vo.value === value
        );
        
        // Find all variants that have this option value
        const variantsWithThisValue = product.variants.filter(variant => 
          variant.options.some(vo => vo.option_id === option.id && vo.value === value)
        );
        
        // Check if this option value can be combined with current selections
        const isAvailable = variantsWithThisValue.some(variant => {
          // For each selected option (except the current one)
          for (const [optionId, selectedValue] of currentSelections.entries()) {
            // Skip checking the current option
            if (optionId === option.id) continue;
            
            // Check if this variant has the same value for the other selected options
            const hasMatchingOption = variant.options.some(
              vo => vo.option_id === optionId && vo.value === selectedValue
            );
            
            if (!hasMatchingOption) return false;
          }
          return true;
        });
        
        // Find a matching variant for navigation
        const matchingVariant = isAvailable ? 
          variantsWithThisValue.find(variant => {
            // Check if this variant matches all other current selections
            for (const [optionId, selectedValue] of currentSelections.entries()) {
              // Skip checking the current option
              if (optionId === option.id) continue;
              
              const hasMatchingOption = variant.options.some(
                vo => vo.option_id === optionId && vo.value === selectedValue
              );
              
              if (!hasMatchingOption) return false;
            }
            return true;
          }) : null;
        
        return {
          id: String(value).toLowerCase().replace(/\s+/g, ''),
          label: String(value),
          variantId: matchingVariant?.metadata?.id || '',
          selected: isSelected,
          available: isAvailable
        };
      });
      
      return {
        id: option.id,
        title: option.title,
        values
      };
    });
    
    setProcessedOptions(options);
  }, [product, selectedVariant]);
  
  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  // Navigate using the variant ID instead of handle
  const handleOptionSelect = (variantId: string) => {
    if (variantId) {
      router.push(variantId);
    }
  };
  
  // Get color class based on color name
  const getColorClass = (colorName: string) => {
    const colorMap: {[key: string]: string} = {
      'gray': styles.colorGray,
      'grey': styles.colorGray,
      'white': styles.colorWhite,
      'gold': styles.colorGold,
      'blue': styles.colorBlue,
      'black': styles.colorGray,
      'silver': styles.colorWhite,
      
      // iPhone-specific titanium colors
      'titanium black': styles.colorGray,
      'black titanium': styles.colorGray,
      'titanium gray': styles.colorGray,
      'gray titanium': styles.colorGray,
      'titanium grey': styles.colorGray,
      'grey titanium': styles.colorGray,
      'titanium white': styles.colorWhite,
      'white titanium': styles.colorWhite,
      'titanium natural': styles.colorWhite,
      'natural titanium': styles.colorWhite,
      'titanium gold': styles.colorGold,
      'gold titanium': styles.colorGold,
      'titanium blue': styles.colorBlue,
      'blue titanium': styles.colorBlue,
      
      // Additional phone colors
      'midnight': styles.colorGray,
      'space black': styles.colorGray,
      'space gray': styles.colorGray,
      'graphite': styles.colorGray,
      'starlight': styles.colorWhite,
      'purple': styles.colorPurple, // Assuming this style exists or will be added
      'pink': styles.colorPink, // Assuming this style exists or will be added
      'red': styles.colorRed, // Assuming this style exists or will be added
      'product red': styles.colorRed,
      'deep purple': styles.colorPurple,
      'sierra blue': styles.colorBlue,
      'pacific blue': styles.colorBlue,
      'alpine green': styles.colorGreen, // Assuming this style exists or will be added
      'midnight green': styles.colorGreen,
      'yellow': styles.colorYellow, // Assuming this style exists or will be added
      'coral': styles.colorCoral, // Assuming this style exists or will be added
      'orange': styles.colorOrange, 
      // Add more mappings as needed
    };
    
    // Try to match color name or similar variants
    for (const [key, value] of Object.entries(colorMap)) {
      if (colorName.toLowerCase().includes(key)) {
        return value;
      }
    }
    
    return ''; // Default
  };
  
  // Get product images - NEW LOGIC
  // Get the variant image (first priority)
  const variantImage = selectedVariant.metadata?.img.split(",").map(url   => url.trim()) || null;
  
  // Get product images, combining variant image with product images
  const productImages = product.images?.map(img => img.url) || [];
  
  // Create final image array with variant image first if available
  const finalImages = variantImage ? [...variantImage, ...productImages] : productImages;
  
  // Format price
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('uk-UA') + ' грн';
  };
  const discountPrice = (amount: number) => {
    const oldPrice = amount * 1.07
    return oldPrice.toLocaleString('uk-UA') + ' грн';
  };
  
  const currentPrice = selectedVariant?.metadata?.price 
    ? formatPrice(selectedVariant?.metadata?.price ) 
    : 'no "price" metadata for this variant'; // Fallback
  
  const oldPrice = selectedVariant?.metadata?.price  
    ? discountPrice(selectedVariant?.metadata?.price) // 7% markup for "old price"
    : 'no "price" metadata for this variant'; // Fallback
  
  // Warranty options (static as these aren't typically part of product data)
  const warrantyOptions = [
    { id: '1', name: 'Гарантія 1 рік', price: 2549 },
    { id: '2', name: 'Гарантія 2 роки', price: 4199 },
  ];

  return (
    <div className={styles.container}>
      {/* <header className={styles.header}>
        <nav className={styles.navigation}>
          <ul className={styles.navTabs}>
            <li className={styles.navItem}>Опис</li>
            <li className={styles.navItem}>Характеристики</li>
            <li className={styles.navItem}>Відгуки (54)</li>
          </ul>
          
        </nav>
      </header> */}

      <div className={styles.productContainer}>
        <div className={styles.productImageSection}>
          <div className={styles.bg}>
              <div className={styles.mainImageContainer}>
                <img 
                  src={finalImages[activeImageIndex] || "/iphone.jpg"} 
                  alt={product.title} 
                  className={styles.mainImage}
                />
              </div>

            <div className={styles.thumbnails}>
              {finalImages.length > 0 ? (
                finalImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnail} ${activeImageIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))
              ) : (
                // Fallback thumbnails if no images
                [1, 2, 3, 4, 5].map((_, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnail} ${activeImageIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src="/iphone.jpg" 
                      alt={`Thumbnail ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          
          
        </div>
        
        <div className={styles.productDetails}>
          <div className={styles.header}>
            <h1 className={styles.productTitle}>{selectedVariant?.title}</h1>
          
            <div className={styles.rating}>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.reviewCount}>(54)</span>
            </div>
            
            <div className={styles.pricing}>
              <span className={styles.currentPrice}>{currentPrice}</span>
              <span className={styles.oldPrice}>{oldPrice}</span>
            </div>
            
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
            {/* Map through each product option */}
            {processedOptions.map((option) => (
              <div key={option.id} className={styles.specRowOption}>
                {/* For color options - special handling */}
                {option.title.toLowerCase().includes('color') || 
                 option.title.toLowerCase().includes('колір') || 
                 option.title.toLowerCase().includes('цвет') ? (
                  <div className={styles.specGroup}>
                    <div className={styles.specTitle}>
                      {option.title}:
                    </div>
                    <div className={styles.colorOptions}>
                      {option.values.map((colorOption) => (
                        <button
                          key={colorOption.id}
                          className={`${styles.colorBtn} 
                                     ${colorOption.selected ? styles.optionBtnActive : ''} 
                                     ${getColorClass(colorOption.label)}
                                     ${!colorOption.available ? styles.optionUnavailable : ''}`}
                          title={colorOption.label}
                          onClick={() => colorOption.available && handleOptionSelect(colorOption.variantId)}
                          disabled={!colorOption.available}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // Dynamic handling for all other option types
                  <div className={styles.specGroup}>
                    <div className={styles.specTitle}>{option.title}:</div>
                    <div className={styles.specOptions}>
                      {option.values.map((optionValue) => (
                        <button
                          key={optionValue.id}
                          className={`${styles.optionBtn} 
                                     ${optionValue.selected ? styles.optionBtnActive : ''} 
                                     ${!optionValue.available ? styles.optionUnavailable : ''}`}
                          onClick={() => optionValue.available && handleOptionSelect(optionValue.variantId)}
                          disabled={!optionValue.available}
                        >
                          {optionValue.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button className={styles.preorderBtn}>
            {product.status === 'draft' ? 'Передзамовлення' : 'Додати у кошик'}
          </button>
          
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
          {product.description ? (
            <div className={styles.productDescription}>
              <div className={styles.descriptionContent}>
                <h2 className={styles.descriptionTitle}>Опис товару:</h2>
                {product.description}
              </div>
            </div>
          ) : null}
        </div>
      </div>      
    </div>
  );
};

export default ProductPage;