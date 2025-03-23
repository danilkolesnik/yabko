'use client';
import styles from './cart.modal.module.scss';
import { useCart } from "@/context/CartContext";
import { useOverlay } from '@/context/OverlayContext';
import { CloseIcon, TrashIcon } from '@/assets/icons/icons';
import { localStorageService } from '@/services/localStorage';

const CartModal = () => {
    const { isCartOpen, closeCart } = useCart();
    const { hideOverlay } = useOverlay();
    if (!isCartOpen) return null;
    const cart = localStorageService({method: 'get', key: 'cart'});

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
            <ul className={styles.miniCart}>
                {/* {(cart || []).map((item: any) => (
                    <div key={item.id}>{item.title}</div>
                ))} */}
                <li className={styles.miniCartItem}>
                    <div className={styles.productPhotoWrapper}>
                        photo
                    </div>
                    <div className={styles.productDetailsWrapper}>
                        <div className={styles.productInfoFlex}>
                            <span className={styles.productName}>
                                Apple iPhone 13 128GB (Starlight)
                            </span>
                            <span className={styles.productPrice}>
                                21 999 грн
                            </span>
                        </div>
                        <div className={styles.productInfoFlex}>
                            <span className={styles.productWarranty}>
                                Гарантiя 1 рiк
                            </span>
                        </div>
                    </div>
                    <div className={styles.productRemoveWrapper}>
                        <TrashIcon />
                    </div>
                </li>
            </ul>
            <div className={styles.priceSection}>
                <span className={styles.priceCaption}>Загальна сума:</span>
                <span className={styles.priceValue}>3 999 грн</span>
            </div>
            <div className={styles.actionSection}>
                <span className={styles.continue}>Продовжити покупки</span>
                <button className={styles.cartButton}>В кошик</button>
            </div>
        </div>
    );
};

export default CartModal;