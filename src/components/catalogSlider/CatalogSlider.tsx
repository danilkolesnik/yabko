"use client";
import { useState, useEffect } from "react";
import styles from "./catalog.slider.module.scss";
import ProductCard from "../productCard/ProductCard";
import { CategoryArrow } from "@/assets/icons/icons";
import { Category } from "@/types/category";
import { CategoryProducts } from "@/types/product";
import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons/icons";

export default function CatalogSlider({ category, categoryProducts, setShowOverlay }: { category: Category, categoryProducts: CategoryProducts, setShowOverlay: any }) {
  function groupProducts(products: any, groupSize = 8, totalSlides = 2) {
    
    if (window.innerWidth < 700) {
        groupSize = 4;
        totalSlides = 2;
    } else if (window.innerWidth >= 700 && window.innerWidth < 1000) {
        groupSize = 6;
        totalSlides = 3;
    }

    let slides = [];
  
    if (products.length < 18) {
        while (slides.length < totalSlides) {
            const slide = [];
            let productIndex = 0;
  
            while (slide.length < groupSize) {
                slide.push(products[productIndex]);
                productIndex = (productIndex + 1) % products.length;
            }
            slides.push(slide);
        }
    } else {
        const first18Products = products.slice(0, 18);
        for (let i = 0; i < totalSlides; i++) {
            slides.push(first18Products.slice(i * groupSize, (i + 1) * groupSize));
        }
    }
  
    return slides;
  }

  
  const [groupedProducts, setGroupedProducts] = useState<any>([]);

  useEffect(() => {
    const allProducts = categoryProducts[category.id];
    if (allProducts) {
      const products = groupProducts(allProducts);
      setGroupedProducts(products);
    }
  }, [categoryProducts]);

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === (groupedProducts || []).length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? (groupedProducts || []).length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide()
    }

    if (touchStart - touchEnd < -50) {
      prevSlide()
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  const goToSlide = (index: number) => {
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className={styles.sliderBlock}>
      <div className={styles.productSliderContainer}>
          <div className={styles.sliderContainer}>
            <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`} aria-label="Previous slide">
              <ChevronLeftIcon customWidth={'15px'} customHeight={'15px'} />
            </button>
            <div
              className={styles.sliderTrack}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {(groupedProducts || []).map((group: any, index: number) => (
                <div
                  key={index}
                  className={`${styles.slide} ${
                    index === currentSlide
                      ? styles.active
                      : index > currentSlide || (currentSlide === (groupedProducts || []).length - 1 && index === 0)
                        ? styles.next
                        : styles.prev
                  }`}
                >
                  <div className={styles.slideContent}>
                    {(group || []).map((product: any, index: number) => (
                      <div key={index} className={styles.productWrapper}>
                        <div className={styles.productImageWrapper}>
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className={styles.productImage}
                          />
                        </div>
                        <span className={styles.productTitle}>{product?.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`} aria-label="Next slide">
                <span className={styles.chevronWrapper}>
                  <ChevronRightIcon customWidth={'15px'} customHeight={'15px'}/>
                </span>
            </button>
          </div>
        </div>
    </div>
  )
}
