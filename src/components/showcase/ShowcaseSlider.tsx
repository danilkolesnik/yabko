"use client";
import { useState, useEffect } from "react";
import styles from "./showcase.slider.module.scss";
import { showcaseSlidesDesktop, showcaseSlidesTablet } from "@/utils/mockup";

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

export default function ShowcaseSlider() {
  const [adaptedSlides, setAdaptedSlides] = useState(showcaseSlidesDesktop);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 1400) {
        setAdaptedSlides(showcaseSlidesTablet);
      } else {
        setAdaptedSlides(showcaseSlidesDesktop);
      }
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === adaptedSlides.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? adaptedSlides.length - 1 : prev - 1))
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
    <div className={styles.sliderContainer}>
      <div
        className={styles.sliderTrack}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {adaptedSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${
              index === currentSlide
                ? styles.active
                : index > currentSlide || (currentSlide === adaptedSlides.length - 1 && index === 0)
                  ? styles.next
                  : styles.prev
            }`}
          >
            <div className={styles.slideContent}>
              <div className={styles.imageWrapper}>
                {slide.images.map((image, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={styles.imageBlock}
                  >
                    <span className={styles.invisibleImageSpan}></span>
                    <img className={styles.sliderImage} src={image} alt={`slide-${slide.id}-image-${imgIndex}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`} aria-label="Previous slide">
        <ChevronLeftIcon />
      </button>

      <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`} aria-label="Next slide">
        <ChevronRightIcon />
      </button>

      {/* Pagination Dots */}
      <div className={styles.pagination}>
        {adaptedSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.paginationDot} ${index === currentSlide ? styles.activeDot : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
