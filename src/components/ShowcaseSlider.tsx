"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import styles from "./showcase.slider.module.scss"

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

const slides = [
  {
    id: 1,
    title: "Мрррійливі",
    subtitle: "ціни",
    product: "Гаджети",
    bgColor: "pink",
    images: [
      { src: "/placeholder.svg?height=100&width=100", alt: "iPhone", className: styles.productTopRight },
      { src: "/placeholder.svg?height=100&width=100", alt: "Headphones", className: styles.productTopLeft },
      { src: "/placeholder.svg?height=100&width=100", alt: "Watch", className: styles.productBottomRight },
      { src: "/placeholder.svg?height=100&width=100", alt: "Controller", className: styles.productBottomLeft },
    ],
    mainImage: "/placeholder.svg?height=300&width=300",
    mainImageAlt: "Cat with products",
  },
  {
    id: 2,
    title: "Стиль на лапках",
    subtitle: "",
    product: "Apple Watch",
    bgColor: "purple",
    images: [
      { src: "/placeholder.svg?height=100&width=100", alt: "Apple Watch 1", className: styles.productTopRight },
      { src: "/placeholder.svg?height=100&width=100", alt: "Apple Watch 2", className: styles.productTopLeft },
      { src: "/placeholder.svg?height=100&width=100", alt: "Apple Watch 3", className: styles.productBottomRight },
      { src: "/placeholder.svg?height=100&width=100", alt: "Apple Watch 4", className: styles.productBottomLeft },
    ],
    mainImage: "/placeholder.svg?height=300&width=300",
    mainImageAlt: "Cat paws with Apple Watch",
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
            className={`${styles.slide} ${styles[slide.bgColor]} ${
              index === currentSlide
                ? styles.active
                : index > currentSlide || (currentSlide === slides.length - 1 && index === 0)
                  ? styles.next
                  : styles.prev
            }`}
          >
            {/* Slide Content */}
            <div className={styles.slideContent}>
            slide
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
  )
}

