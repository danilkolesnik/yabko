'use client'
import { useEffect, useState } from 'react';
import { useOverlay } from '@/context/OverlayContext';
import styles from './header.module.scss';
import { Logo, CartIcon } from '@/assets/icons/icons'
import CatalogButton from '@/ui/CatalogButton';
import Search from '@/ui/Search';
import CartButton from '@/ui/CartButton';
import MobileCategories from "@/components/mobileCategories/MobileCategories";
import CategoriesList from '@/components/CategoriesList';
import { medusa } from "@/lib/medusa";
import Hamburger from 'hamburger-react'

export default function Header() {
  const { showOverlay, hideOverlay } = useOverlay();
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(false);
  const [isTop, setIsTop] = useState(true);

  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productCategories, setProductCategories] = useState<any[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [{ products }, { product_categories }] = await Promise.all([
          medusa.products.list(),
          medusa.productCategories.list(),
        ]);
        setProducts(products);
        setProductCategories(product_categories);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();

    const handleScroll = () => {
      setIsTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <header className={`${styles.header} ${isCategoryListVisible ? styles.categoriesVisible : ''}`}>
      <div className={`${styles.phoneBar} ${isTop ? styles.visible : styles.hidden}`}>
        <a className={styles.phoneLink} href="tel:0800330386">
          0 800 33 03 86
        </a>
      </div>
      <div className={styles.mainHeader}>
        <span onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)} className={styles.burgerWrapper}>
          <Hamburger />
        </span>
        {isMobileCategoriesOpen && <MobileCategories productCategories={productCategories}/>}
        <a href='/' className={styles.logo}>
          <Logo />
        </a>
        <div
          className={styles.catalogContainer}
          onMouseEnter={() => {
            setIsCategoryListVisible(true);
            showOverlay();
          }}
          onMouseLeave={() => {
            setIsCategoryListVisible(false);
            hideOverlay();
          }}
        >
          <a className={styles.catalogButtonWrapper} href="/#catalog">
            <CatalogButton />
          </a>
          <div className={`${styles.dropdownContainer} ${isTop ? styles.top : ''}`}>    
            {isCategoryListVisible && <CategoriesList products={products} productCategories={productCategories} />}
          </div>
        </div>
        <div className={styles.searchWrapper}>
          <Search />
          <CartButton />
        </div>
        <span onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)} className={styles.burgerWrapper}>
          <CartIcon />
        </span>
      </div>
    </header>
  )
}
