'use client'; 
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './ProductSlider.module.scss';
import ProductCard from './ProductCard';
import { getProducts } from '@/app/page';


interface SliderProps {
  products: Product[];
}


const Slider = dynamic(() => import('react-slick'), { ssr: false });

//@ts-ignore
const ProductSlider: React.FC = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null); 
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 5000,
    afterChange: (index: number) => setCurrentSlide(index),
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 778,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const progress = ((currentSlide + 1) / products?.length) * 100;

  return (
    <div className={styles.productSlider}>
      {/* @ts-ignore */}
      <Slider ref={sliderRef as React.RefObject<any>} {...settings}>
        {/* @ts-ignore */}
        {products?.length > 0 ? (products.map((product, index) => (
          <div key={index} className={styles.slide}>
            <ProductCard product={product}/>
          </div>
        ) )): <p>can find products</p>}
      </Slider>

      {/* Progress bar */}
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={styles.progressLine}
                style={{
                  width: `${progress}%`,
                  backgroundColor: i === currentSlide % 3 ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProductSlider;