'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './cart.dropdown.module.scss';
import { localStorageService } from '@/services/localStorage';
import { TrashIcon } from '@/assets/icons/icons';

export default function CartDropdown() {
    const router = useRouter();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCart(localStorageService({method: 'get', key: 'cart'}));
        // console.log(localStorageService({method: 'get', key: 'cart'}));
    }, []);

    return (
        <div className={styles.cartDropdown}>
            <ul className={styles.cartItemsList}>
                {(cart || []).map((item: any) => (
                    <li key={item.id} onClick={() => router.push(`/${item.handle}`)} className={styles.miniCartItem}>
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
                        </div>
                        <div className={styles.productRemoveWrapper}>
                            <TrashIcon />
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.goToCartWrapper}>
                <button onClick={() => router.push('/cart')} className={styles.goToCartButton}>Оформити замовлення</button>
            </div>
        </div>
    );
};
