import styles from './cart.button.module.scss'
import { CartIcon } from '@/assets/icons/icons'

export default function CartButton() {
  return (
    <button className={styles.cartButton} type="button">
      <span className={styles.invisibleButtonSpan}></span>
      <span className={styles.buttonContent}>
        <span className={styles.cartButtonCaption}>Твiй кошик</span>
        <CartIcon />
      </span>
    </button>
  )
}
