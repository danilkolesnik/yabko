'use client';
import styles from './cart.modal.module.scss';
import { useCart } from "@/context/CartContext";
import { useOverlay } from '@/context/OverlayContext';
import { CloseIcon } from '@/assets/icons/icons';
import { localStorageService } from '@/services/localStorage';

const CartModal = () => {
    const { isCartOpen, closeCart } = useCart();
    const { hideOverlay } = useOverlay();
    if (!isCartOpen) return null;
    const cart = localStorageService({method: 'get', key: 'cart'});
    console.log(cart);
    const handleCloseModal = () => {
        closeCart();
        hideOverlay();
    };

    return (
        <div className={styles.cartModal}>
            <header className={styles.header}>
                <h6>Твiй кошик</h6>
                <span onClick={handleCloseModal} className={styles.closeWrapper}>
                    <CloseIcon />
                </span>
            </header>
            <div className={styles.miniCart}>
                {(cart || []).map((item: any) => (
                    <div key={item.id}>{item.title}</div>
                ))}
            </div>
            <div className={styles.priceSection}>
                <span className={styles.priceCaption}>Загальна сума:</span>
                <span className={styles.priceValue}>3 999 грн</span>
            </div>
            <div className={styles.actionSection}>
                <span>Продовжити покупки</span>
                <button>В кошик</button>
            </div>
        </div>
    );
};

export default CartModal;