"use client";
import { useState, useEffect } from "react";
import styles from "./product.slider.module.scss";
import ProductCard from "./ProductCard";
import { CategoryArrow } from "@/assets/icons/icons";

const ChevronLeftIcon = ({ customWidth, customHeight }: { customWidth: string, customHeight: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={customWidth || "24px"}
    height={customHeight || "24px"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({ customWidth, customHeight }: { customWidth: string, customHeight: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={customWidth || "24px"}
    height={customHeight || "24px"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const slides = [
  {
    id: 1,
    images: [
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
    ]
  },
  {
    id: 2,
    images: [
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
    ]
  },
  {
    id: 3,
    images: [
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
      'https://img.jabko.ua/image/cache/catalog/products/2025/03/061655/88-desc-max-1700.png.webp',
    ]
  },
]

export default function ShowcaseSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
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
    <div className={styles.productSliderContainer}>
      <header className={styles.productSliderHeader}>
        <span className={styles.headerCaptionWrapper}>
          <h3 className={styles.categoryName}>{'{'}Категорiя{'}'}</h3>
          <a className={styles.categoryLink} href="#">В категорiю <CategoryArrow /></a>
        </span>
        <div className={styles.customButtonsWrapper}>
          <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`} aria-label="Previous slide">
            <ChevronLeftIcon customWidth={'15px'} customHeight={'15px'} />
          </button>

          <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`} aria-label="Next slide">
            <span className={styles.chevronWrapper}>
              <ChevronRightIcon customWidth={'15px'} customHeight={'15px'}/>
            </span>
          </button>
        </div>
      </header>
      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderTrack}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${
                index === currentSlide
                  ? styles.active
                  : index > currentSlide || (currentSlide === slides.length - 1 && index === 0)
                    ? styles.next
                    : styles.prev
              }`}
            >
              <div className={styles.slideContent}>
                <ProductCard product={{}}/>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Dots */}
        <div className={styles.pagination}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.paginationDot} ${index === currentSlide ? styles.activeDot : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
