'use client'
import { useEffect, useState } from 'react'
import styles from './header.module.scss'
import { Logo } from '@/assets/icons/icons'
import CatalogButton from '@/ui/CatalogButton';
import Search from '@/ui/Search';
import CartButton from '@/ui/CartButton';

export default function Header() {
  const [isTop, setIsTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={styles.header}>
      <div className={`${styles.phoneBar} ${isTop ? styles.visible : styles.hidden}`}>
        <a className={styles.phoneLink} href="tel:0800307775">
          0 800 30 777 5
        </a>
      </div>
      <div className={styles.mainHeader}>
        <span className={styles.logo}>
          <Logo />
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
