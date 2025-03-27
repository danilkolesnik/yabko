'use client';
import { useCart } from "@/context/CartContext";
import { useOverlay } from "@/context/OverlayContext";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { localStorageService } from "@/services/localStorage";
import { styleText } from "util";
import { div } from "framer-motion/client";
import { CategoryArrow, InfoIcon } from "@/assets/icons/icons";

interface ProductPageClientProps {
  product: any;
  initialVariant: any;
}

const ProductPage = ({ product, initialVariant }: ProductPageClientProps) => {
  const router = useRouter();

  const { openCart } = useCart();
  const { showOverlay } = useOverlay();
  
  const handleAddToCart = () => {
    localStorageService({method: 'set', key: 'cart', value: JSON.stringify(product)});
    router.push(`/cart`);
    showOverlay();
    openCart();
  }

  // State for active image, selected variant, and processed options
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [selectedWarranty, setSelectedWarranty] = useState('2');
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  // Processed options for UI rendering
  const [processedOptions, setProcessedOptions] = useState<any[]>([]);

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
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
  const variantImage = selectedVariant.metadata?.img?.split(",").map(url => url.trim()) || null;
  const almostReviews = selectedVariant.metadata?.reviews?.split(",").map(r => r.trim()) || null;
  const reviews = almostReviews?.map(review => review.split(":")) || null;
  console.log(reviews)
  
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

  // Handle star rating click
  const handleRatingClick = (index: number) => {
    setRating(index);
  };

  // Handle review form submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the review submission to your backend
    alert("Дякуємо! Ваш відгук буде опубліковано після перевірки модератором.");
    // Reset form
    setReviewerName('');
    setReviewText('');
    setRating(0);
  };

  // Handle file input click
  const handleFileButtonClick = () => {
    document.getElementById('photo-upload')?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Selected files:', files);
      // Here you would handle file upload
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.productHeader}>
            <nav className={styles.productHeaderNav}>
              <a href="/">Головна</a>
              <a href="#description">Опис</a>
              <a href="#reviews">Вiдгуки</a>
            </nav>
          </div>
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
                  <div className={styles.paymentIcon}>
                    <img src="https://img.jabko.ua/image/cache/catalog/products/2024/11/051707/PUMB_SCH_full.png.webp" width="19" height="19" loading="lazy" alt="" />
                  </div>
                  <span className={styles.paymentOptionSpan}>Оплата Частинами</span>
                </div>
                <div className={styles.paymentOption}>
                  <div className={styles.paymentIcon}>
                    <img src="https://img.jabko.ua/image/cache/catalog/products/2024/07/260626/free-icon-delivery-truck-5470239-(1)full.png.webp" width="19" height="19" loading="lazy" alt="" />
                  </div>
                  <span className={styles.paymentOptionSpan}>Безкоштовна доставка</span>
                </div>
                <div className={styles.paymentOption}>
                  <div className={styles.paymentIcon}>
                    <img src="https://img.jabko.ua/image/cache/catalog/products/2024/11/011237/exchangefull.png.webp" width="19" height="19" loading="lazy" alt="" />
                  </div>
                  <span className={styles.paymentOptionSpanSpecial}>Вигідний TRADE-IN</span>
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
              
              <div className={styles.warrantyNote}>
                <span>
                  Гарантiю 1 рiк вiд магазину включено у вартiсть.
                </span>
              </div>
              <button onClick={handleAddToCart} className={styles.preorderBtn}>
                {product.status === 'draft' ? 'Передзамовлення' : 'Купити'}
              </button>
              
              <div className={`${styles.specRow} ${styles.unique}`}>
                <div className={styles.warrantyInfo}>
                  <h3 className={styles.warrantyTitle}>Гарантія та доставка:</h3>
                  <div className={styles.warrantyItem}>
                    <span className={styles.warrantyIcon}>🚚</span>
                    <span className={styles.warrantyText}>Безкоштовна доставка у магазин та відділення Нової Пошти.</span>
                    <span className={styles.infoIcon}>ⓘ</span>
                  </div>
                  <div className={styles.warrantyItem}>
                    <span className={styles.warrantyIcon}>🛡️</span>
                    <span className={styles.warrantyText}>Гарантiя вiд виробника та магазину до 1 року.</span>
                    <span className={styles.infoIcon}>ⓘ</span>
                  </div>
                  <div className={styles.warrantyItem}>
                    <span className={styles.warrantyIcon}>🔄</span>
                    <span className={styles.warrantyText}>Швидкий обмiн та повернення протягом 14 днiв.</span>
                    <span className={styles.infoIcon}>ⓘ</span>
                  </div>
                </div>
              </div>

              <div className={styles.mobileWarrantyWrapper}>
                <header className={styles.mobileWarrantyHeader}>
                  <h6>Гарантія та доставка:</h6>
                </header>
                <div className={styles.mobileWarrantyContainer}>
                  <div className={styles.mobileWarrantyRow}>
                    <span className={styles.warrantyIcon}>
                      <img src="https://img.jabko.ua/image/iconproduct/_delivery.svg" alt="Apple iPhone 15 128GB (Blue)" loading="lazy" />
                    </span>
                    <span className={styles.mobileWarrantyText}>Безкоштовна доставка у магазин та відділення Нової Пошти.</span>
                    <span className={`${styles.warrantyIcon} ${styles.mobileInfo}`}>
                      <InfoIcon />
                    </span>
                  </div>

                  <div className={styles.mobileWarrantyRow}>
                    <span className={styles.warrantyIcon}>
                      <img src="https://img.jabko.ua/image/cache/-main-new/medalfull.png.webp" alt="Apple iPhone 15 128GB (Blue)" loading="lazy"/>
                    </span>
                    <span className={styles.mobileWarrantyText}>Гарантія від виробника та магазину  до 2 років.</span>
                    <span className={`${styles.warrantyIcon} ${styles.mobileInfo}`}>
                      <InfoIcon />
                    </span>
                  </div>

                  <div className={styles.mobileWarrantyRow}>
                    <span className={styles.warrantyIcon}>
                      <img src="https://img.jabko.ua/image/iconproduct/_flip.svg" alt="Apple iPhone 15 128GB (Blue)" loading="lazy" />
                    </span>
                    <span className={styles.mobileWarrantyText}>Безкоштовна доставка у магазин та відділення Нової Пошти.</span>
                    <span className={`${styles.warrantyIcon} ${styles.mobileInfo}`}>
                      <InfoIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomFlex}>
          {/* Description Section */}
            <div className={styles.innerMainFlex}>
              <div id='description' className={styles.decriptionContainer}>
                <header className={styles.descriptionHeader} onClick={() => setDescriptionOpen(!descriptionOpen)}>
                  <h6>Детальнiше про {product?.title}</h6>
                  <span className={`${styles.arrowWrapper} ${descriptionOpen ? styles.expanded : ''}`}>
                    <CategoryArrow />
                  </span>
                </header>
                { descriptionOpen && (
                  <div className={styles.descriptionContent}>
                    {product?.description}
                  </div>
                )}
              </div>
              {/* Review Section */}
              <div className={styles.reviewContainer} id='reviews'>
                <div className={styles.sameContainer}>
                  <div className={styles.formWrapper}>
                      <h2 className={styles.reviewTitle}>Відгуки клієнтів про {selectedVariant?.title}</h2>
                    
                    <div className={styles.overallRating}>
                      {/* <div className={styles.ratingStars}>★★★★★</div> */}
                      <div className={styles.ratingValue}>
                        Загальний рейтинг товару: <div className={styles.ratingStars}>★★★★★</div> <span className={styles.reviewCount}>(44 відгуків)</span>
                      </div>
                    </div>
                    
                    <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                      <div className={styles.reviewFormField}>
                        {/* <div className={styles.rate}></div> */}
                        <input
                          type="text"
                          placeholder="Ваше ім'я"
                          className={styles.reviewFormInput}
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          required
                        />
                        <div className={styles.starRating}>
                          <div className={styles.ratingLabel}>Оцінка:</div>
                            <div className={styles.stars}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`${styles.star} ${rating >= star || hoverRating >= star ? styles.active : ''}`}
                                  onClick={() => handleRatingClick(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                      </div>
                      
                      
                      
                      <div className={styles.reviewFormField}>
                        <textarea
                          placeholder="Ваш коментарий"
                          className={styles.reviewFormTextarea}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      
                      <div className={styles.buttonGroup}>
                        <input
                          type="file"
                          id="photo-upload"
                          className={styles.fileInput}
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          className={`${styles.reviewFormButton} ${styles.photoButton}`}
                          onClick={handleFileButtonClick}
                        >
                          <span>📷</span> Додати фотографії
                        </button>
                        <button type="submit" className={styles.reviewFormButton}>
                          Залишити відгук
                        </button>
                      </div>
                    </form>
                  </div>
                
                  
                  {reviews?.map((review, i) => (
                    <div className={styles.reviewsList} key={almostReviews[i]}>
                    
                    
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewerName}>{review[0]}</div>
                          
                        </div>
                        <div className={styles.reviewStars}>★★★★★</div>
                        <div className={styles.reviewText}>
                          {review[1]}
                        </div>
                        
                      </div>
                    
                    
                    </div>
                  ))}
                  
                  
                </div>
              </div>
            </div>
            <div className={styles.variantSidebar}>
              <img
                src={finalImages[0] || "/iphone.jpg"}
                alt={selectedVariant?.title}
                className={styles.variantImage}
              />
              <h3 className={styles.variantTitle}>
                {selectedVariant?.title}
              </h3>
              <div className={styles.variantPrice}>
                <span className={styles.variantCurrentPrice}>{currentPrice}</span>
                <span className={styles.variantOldPrice}>{oldPrice}</span>
              </div>
              <button className={styles.buyButton} onClick={handleAddToCart}>
                Купити
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Variant Sidebar */}
        
      </div>
    </div>
  );
};

export default ProductPage;