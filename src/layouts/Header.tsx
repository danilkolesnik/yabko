'use client';
import styles from './header.module.scss';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useMobileCategories } from '@/context/MobileCategoriesContext';
import { useOverlay } from '@/context/OverlayContext';
import { Logo, CartIcon, MobileCallIcon, MobileSearchIcon } from '@/assets/icons/icons'
import CatalogButton from '@/ui/CatalogButton';
import Search from '@/ui/Search/Search';
import SearchBar from '@/ui/Search/SearchBar';
import CartButton from '@/ui/CartButton';
import MobileCategories from "@/components/mobileCategories/MobileCategories";
import CategoriesList from '@/components/CategoriesList';
import Hamburger from 'hamburger-react';
import { phoneNumber } from '@/utils/constants';
import { medusa } from "@/lib/medusa";

export default function Header() {
  const { showOverlay, hideOverlay } = useOverlay();
  const { isCategoriesOpen, setCategoriesOpen } = useMobileCategories();

  const [isTop, setIsTop] = useState(true);

  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productCategories, setProductCategories] = useState<any[]>([]);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // useEffect(() => { console.log(isSearchOpen) }, [isSearchOpen]);
  
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
        <a className={styles.phoneLink} href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
          {phoneNumber}
        </a>
      </div>
      <div className={styles.mainHeader}>
        <div className={styles.mobileHeaderFlex}>
          <span onClick={() => setCategoriesOpen(!isCategoriesOpen)} className={styles.burgerWrapper}>
            <Hamburger toggled={isCategoriesOpen} size={24} />
          </span>
          <span className={styles.searchIconWrapper} onClick={() => setIsSearchOpen(true)}>
            <MobileSearchIcon />
          </span>
        </div>
        <MobileCategories isCategoriesOpen={isCategoriesOpen} productCategories={productCategories}/>
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
          <Search setIsSearchOpen={setIsSearchOpen} showOverlay={showOverlay} hideOverlay={hideOverlay} />
          <CartButton />
        </div>
        <div className={styles.mobileHeaderFlex}>
          <a className={styles.burgerWrapper} href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
            <MobileCallIcon />
          </a>
          <a className={styles.burgerWrapper} href="/cart">
            <CartIcon />
          </a>
        </div>
      </div>
      {isSearchOpen && <SearchBar setIsSearchOpen={setIsSearchOpen} hideOverlay={hideOverlay} />}
    </header>
  )
}
