'use client'
import { useEffect, useState } from 'react'
import styles from './header.module.scss'
import { Logo } from '@/assets/icons/icons'
import CatalogButton from '@/ui/CatalogButton';
import Search from '@/ui/Search';
import CartButton from '@/ui/CartButton';
import MobileCategories from "@/components/mobileCategories/MobileCategories";
import { medusa } from "@/lib/medusa";
import Hamburger from 'hamburger-react'

export default function Header() {

  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(true);
  const [isTop, setIsTop] = useState(true)
  const [productCategories, setProductCategories] = useState<any[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const { product_categories } = await medusa.productCategories.list()
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
    <header className={styles.header}>
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
        <span className={styles.burgerWrapper}>
          cart
        </span>
        <CatalogButton />
        <div className={styles.searchWrapper}>
          <Search />
          <CartButton />
        </div>
      </div>
    </header>
  )
}
