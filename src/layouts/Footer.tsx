import styles from './footer.module.scss';
import { TelegramIcon, ApplePayIcon } from '@/assets/icons/icons';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <nav className={styles.footerNav}>
                    <span className={styles.footerNavCaption}>Продукція</span>
                    <div className={styles.footerItemsContainer}>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">iPhone</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">iPad</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Mac</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Apple Watch</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">AirPods</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Гаджети</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Аксесуари</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Веснянi знижки</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Dyson</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Samsung Galaxy</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Смартфони</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Смарт-годинники</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Телевiзори</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Планшети</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Консолi та геймiнг</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Ноутбуки</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">ПК та аксесуари</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Технiка для дому</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Краса та здоров'я</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Розумний дiм</a>
                        </div>
                        <div className={styles.footerItem}>
                            <a className={styles.footerLink} href="#">Фото та аудiо</a>
                        </div>
                    </div>
                </nav>
                <div className={styles.footerSideBlock}>
                    <span className={styles.footerNavCaption}>Для зв’язку та запитань</span>
                    <div className={styles.footerContactWrapper}>
                        <a className={styles.footerContactLink} href="#">info@jabko.ua</a>
                        <span>
                            <a className={styles.footerContactLink} href="#">0 800 33 03 86 </a>
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
        </footer>
    )
}