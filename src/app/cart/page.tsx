'use client';
import { useEffect, useState } from 'react';
import styles from './cart.module.scss';
import { localStorageService } from '@/services/localStorage';
import { TrashIcon } from '@/assets/icons/icons';
import Input from '@/ui/Input/Input';

export default function CartPage() {
    
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCart(localStorageService({method: 'get', key: 'cart'}));
    }, []);

    return (
        <section className={styles.mainCart}>
            <div className={styles.mainCartFlex}>
                <div className={styles.sideBlockWrapper}>
                    <div className={styles.contactInfoBlock}>
                        <h6 className={styles.sideBlockCaption}>Контактна iнформацiя:</h6>
                        <Input label="name" type="text" placeholder="* Iм'я" required/>
                        <Input label="lastName" type="text" placeholder="Прiзвище" />
                        <Input label="phone" type="text" placeholder="Ваш номер телефону" />
                        <Input label="email" type="email" placeholder="Email" />
                    </div>
                    <div className={styles.deliveryBlock}>
                    <h6 className={styles.sideBlockCaption}>Доставка i оплата (soon)</h6>
                    </div>
                </div>
                <div className={styles.cartItemsWrapper}>
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
                    <div className={styles.cartTotal}>
                        <span className={styles.cartTotalCaption}>Сума замовлення:</span>
                        <span className={styles.cartTotalValue}>55 699 грн</span>
                    </div>
                </div>
            </div>
        </section>
    )
};