import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './cart.button.module.scss';
import { CartIcon } from '@/assets/icons/icons';
import CartDropdown from './CartDropdown';

export default function CartButton() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div
      className={styles.cartContainer}
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <button className={styles.cartButton} type="button">
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
        <CartDropdown />
      </motion.div>
    </div>
  );
}
