'use client'; // Указываем, что это клиентский компонент

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './ProductSlider.module.scss';
import ProductCard, { Product } from './ProductCard';
import { useEffect } from "react";
import { getProducts } from '@/app/page';


interface SliderProps {
  products: Product[];
}


const Slider = dynamic(() => import('react-slick'), { ssr: false });


const ProductSlider: React.FC<SliderProps> = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Текущий слайд
  // const [products, setProducts] = useState<any[]>([])
  const sliderRef = useRef<any>(null); // Ссылка на слайдер

  //!!!!!!                  INFO            !!!!!!!!!!
  // я пытался подключить сюда getProducts, но у меня так и не вышло , тут в целом все готово , просто выведи переменную продукты , дальше там все сдлеано , слайдер и карты 


  // Настройки слайдера
  const settings = {
    dots: false, // Отключаем стандартные точки
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true, // Включаем автопрокрутку
    autoplaySpeed: 5000, // Интервал автопрокрутки (5 секунд)
    afterChange: (index: number) => setCurrentSlide(index), // Обновляем текущий слайд
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

  // Прогресс-бар
  const progress = ((currentSlide + 1) / products.length) * 100;

  return (
    <div className={styles.productSlider}>
      {/* Используем ref с явным приведением типа */}
      <Slider ref={sliderRef as React.RefObject<any>} {...settings}>
        {products.length > 0 ? (products.map((product, index) => (
          <div key={index} className={styles.slide}>
            <ProductCard product={product}/>
          </div>
        ) )): <p>can find products</p>}
      </Slider>

      {/* Прогресс-бар из трёх полосок */}
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