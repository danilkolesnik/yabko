'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './cart.button.module.scss';
import { localStorageService } from '@/services/localStorage';
import { CartIcon } from '@/assets/icons/icons';
import CartDropdown from './CartDropdown';

export default function CartButton() {

  const [cart, setCart] = useState([]);
  
  useEffect(() => {
      setCart(localStorageService({method: 'get', key: 'cart'}));
  }, []);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div
      className={styles.cartContainer}
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <button className={`${styles.cartButton} ${cart?.length > 0 && styles.active}`} type="button">
        <span className={styles.invisibleButtonSpan}></span>
        <span className={styles.buttonContent}>
          <span className={styles.cartButtonCaption}>Твiй кошик</span>
          <CartIcon />
        </span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: isDropdownVisible ? 1 : 0, y: isDropdownVisible ? 0 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ display: isDropdownVisible ? 'block' : 'none' }}
      >
        {cart?.length > 0 && <CartDropdown />}
      </motion.div>
    </div>
  );
}
