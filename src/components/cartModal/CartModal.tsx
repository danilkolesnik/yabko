'use client';
import styles from './cart.modal.module.scss';
import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';
import { useOverlay } from '@/context/OverlayContext';
import { CloseIcon, TrashIcon } from '@/assets/icons/icons';
import { localStorageService } from '@/services/localStorage';

const CartModal = () => {
    const router = useRouter();
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
            <ul className={styles.miniCart}>
                {(cart || []).map((item: any) => (
                    <li key={item.id} className={styles.miniCartItem}>
                        <div className={styles.productPhotoWrapper}>
                            {item.images && <img src={item.images[0].url} alt="" />}
                        </div>
                        <div className={styles.productDetailsWrapper}>
                            <div className={styles.productInfoFlex}>
                                <span className={styles.productName}>
                                    {item.title}
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
                ))}
                
            </ul>
            <div className={styles.priceSection}>
                <span className={styles.priceCaption}>Загальна сума:</span>
                <span className={styles.priceValue}>21 999 грн</span>
            </div>
            <div className={styles.actionSection}>
                <span className={styles.continue}>Продовжити покупки</span>
                <button onClick={() => router.push('/cart')} className={styles.cartButton}>В кошик</button>
            </div>
        </div>
    );
};

export default CartModal;