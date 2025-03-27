'use client';
import { useState } from 'react';
import styles from './footer.module.scss';
import { TelegramIcon, ApplePayIcon } from '@/assets/icons/icons';
import { AccordeonIcon } from '@/assets/icons/icons';
import { footerLinks } from '@/utils/constants';
import { phoneNumber, email } from '@/utils/constants';

type MenuState = {
    products: boolean;
    information: boolean;
    contacts: boolean;
};
  
export default function Footer() {

    const [isMenuOpen, setIsMenuOpen] = useState<MenuState>({
        products: false,
        information: false,
        contacts: false,
    });

    const toggleMenu = (key: keyof MenuState) => {
        setIsMenuOpen((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <nav className={styles.footerNav}>
                    <span className={styles.footerNavCaption}>Продукція</span>
                    <div className={styles.footerItemsContainer}>
                        {footerLinks.map((link, index) => (
                            <div className={styles.footerItem} key={index}>
                                <a className={styles.footerLink} href={link.href}>
                                    {link.title}
                                </a>
                            </div>
                        ))}
                    </div>
                </nav>
                <div className={styles.footerSideBlock}>
                    <span className={styles.footerNavCaption}>Для зв’язку та запитань</span>
                    <div className={styles.footerContactWrapper}>
                        <a className={styles.footerContactLink} href="#">{email}</a>
                        <span>
                            <a className={styles.footerContactLink} href="#">{phoneNumber} </a>
                            <span className={styles.footerTimeNote}>
                                (з 9:00 до 22:00)
                            </span>
                        </span>
                        <a target="_blank" href="https://t.me/jabkodrug" className={styles.footerTelegramLink} aria-label="Telegram">
                            <TelegramIcon />
                        </a>
                        <div className={styles.footerPaymentsWrapper}>
                        <img width="90" height="25" loading="lazy" src="https://img.jabko.ua/image/cache/paymentsfull.png.webp" alt="" />
                            <span className={styles.svgPaymentItem}>
                                <ApplePayIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footerMobile}>
                <div className={styles.accordeon}>
                    <header className={styles.accordeonHeader} onClick={() => toggleMenu("products")}>
                        <span className={styles.accordeonTitle}>Продукцiя</span>
                        <span className={`${styles.arrowWrapper} ${isMenuOpen.products ? styles.expanded : ""}`}>
                            <AccordeonIcon />
                        </span>
                    </header>
                    <div className={`${styles.mobileNavWrapper} ${isMenuOpen.products ? styles.open : ""}`}>
                        {footerLinks.map((link, index) => (
                            <a key={index} className={styles.mobileNavItem} href={link.href}>
                                {link.title}
                            </a>
                        ))}
                    </div>
                </div>
                <div className={styles.accordeon}>
                    <header className={styles.accordeonHeader} onClick={() => toggleMenu("information")}>
                        <span className={styles.accordeonTitle}>Iнформацiя</span>
                        <span className={`${styles.arrowWrapper} ${isMenuOpen.information ? styles.expanded : ""}`}>
                            <AccordeonIcon />
                        </span>
                    </header>
                    <div className={`${styles.mobileNavWrapper} ${isMenuOpen.information ? styles.open : ""}`}>
                        Тут буде iнформацiя
                    </div>
                </div>
                <div className={styles.accordeon}>
                    <header className={styles.accordeonHeader} onClick={() => toggleMenu("contacts")}>
                        <span className={styles.accordeonTitle}>Для зв'язку та запитань</span>
                        <span className={`${styles.arrowWrapper} ${isMenuOpen.contacts ? styles.expanded : ""}`}>
                            <AccordeonIcon />
                        </span>
                    </header>
                    <div className={`${styles.mobileRegularWrapper} ${isMenuOpen.contacts ? styles.open : ""}`}>
                        <div className={styles.mobileItemWrapper}>
                            <span className={styles.mobileIcon}>
                                <img loading="lazy" src="https://img.jabko.ua/image/cache/icons/white/phonefull.png.webp" alt="" />
                            </span>
                            <span className={styles.mobileItemName}>{phoneNumber}</span>
                        </div>
                        <div className={styles.mobileItemWrapper}>
                            <span className={styles.mobileIcon}>
                                <img loading="lazy" src="https://img.jabko.ua/image/cache/icons/white/mailfull.png.webp" alt="" />
                            </span>
                            <span className={styles.mobileItemName}>{email}</span>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}