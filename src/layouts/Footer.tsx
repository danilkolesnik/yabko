import styles from './footer.module.scss';

const TelegramIcon = () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#icon-tg)">
            <path fillRule="evenodd" clipRule="evenodd" d="M21.4255 4.79913C21.6932 4.68645 21.9863 4.64759 22.2741 4.68659C22.5619 4.72559 22.834 4.84102 23.0621 5.02087C23.2902 5.20072 23.4659 5.43842 23.5709 5.70922C23.676 5.98002 23.7065 6.27402 23.6594 6.56063L21.2024 21.464C20.964 22.9016 19.3867 23.726 18.0683 23.01C16.9654 22.4109 15.3274 21.4879 13.8541 20.5248C13.1174 20.0427 10.8609 18.499 11.1382 17.4005C11.3765 16.4612 15.1682 12.9317 17.3349 10.8333C18.1853 10.0089 17.7974 9.5333 16.7932 10.2916C14.2994 12.1745 10.2954 15.0377 8.97152 15.8437C7.80369 16.5544 7.19485 16.6757 6.46685 16.5544C5.13869 16.3334 3.90694 15.991 2.90161 15.574C1.54311 15.0106 1.60919 13.143 2.90052 12.5991L21.4255 4.79913Z" fill="currentColor">
            </path>
        </g>
        <defs>
            <clipPath id="icon-tg">
                <rect width="26" height="26" fill="white"></rect>
            </clipPath>
        </defs>
    </svg>
);

const ApplePayIcon = () => (
    <svg viewBox="0 0 33 21" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="33" height="21" rx="2" fill="#9C9FA2"></rect>
        <path d="M17.2561 8.05358C17.2561 9.16514 16.5464 9.80464 15.2952 9.80464H13.652V6.30368H15.3025C16.5464 6.30368 17.2561 6.9362 17.2561 8.05358ZM20.4682 12.0975C20.4682 12.6335 20.9551 12.9824 21.7194 12.9824C22.6932 12.9824 23.4235 12.3952 23.4235 11.5673V11.0697L21.8339 11.1662C20.9344 11.2243 20.4682 11.5417 20.4682 12.0975ZM32.5243 3.50016L31.7137 18.0002C31.7133 18.8225 32.3224 19.0979 31.7137 19.6794C31.1049 20.2609 29.4379 19.6791 28.577 19.6794L2.72132 20.2582C1.86048 20.2579 2.10856 18.5816 1.49984 18.0002C0.891132 17.4187 0.999847 16.3225 0.999525 15.5002L1.84579 3.00008C1.84611 2.17775 2.09931 2.08157 2.70802 1.50009C3.31674 0.918605 1.86048 0.57941 2.72132 0.579102L30.2604 1.15761C31.1212 1.15792 30.3913 1.41852 31 2C31.6087 2.58148 32.524 2.67783 32.5243 3.50016ZM5.46285 6.68389C6.03127 6.72923 6.59847 6.41297 6.95754 6.01183C7.3093 5.5979 7.53935 5.04328 7.47849 4.48053C6.97823 4.50029 6.35625 4.79679 5.99719 5.21071C5.6722 5.56651 5.3959 6.1409 5.46285 6.68389ZM9.56107 11.4964C9.54769 11.4836 8.23557 11.0057 8.22218 9.55814C8.20879 8.35007 9.25678 7.76871 9.30425 7.73615C8.70905 6.89666 7.78887 6.80597 7.47119 6.78621C6.64594 6.74086 5.94241 7.23153 5.55048 7.23153C5.15125 7.23153 4.55605 6.80481 3.9073 6.81876C3.48374 6.82951 3.07051 6.94605 2.70876 7.15678C2.34701 7.36751 2.04935 7.66508 1.8454 8.01986C0.959297 9.48024 1.61535 11.6371 2.47468 12.8254C2.89339 13.4126 3.40095 14.059 4.06431 14.0335C4.69237 14.0079 4.94311 13.6463 5.70019 13.6463C6.46458 13.6463 6.68124 14.0335 7.34338 14.0276C8.03352 14.0149 8.45953 13.4405 8.88554 12.8521C9.35172 12.1801 9.54769 11.5348 9.56229 11.4952L9.56107 11.4964ZM18.7167 8.04776C18.7167 6.32926 17.4654 5.15374 15.6798 5.15374H12.2182V13.9649H13.652V10.9546H15.6336C17.4459 10.9546 18.7167 9.76627 18.7167 8.04776ZM24.8025 9.5779C24.8025 8.30589 23.7339 7.485 22.098 7.485C20.5765 7.485 19.4543 8.31868 19.4129 9.45466H20.7043C20.8126 8.91166 21.3397 8.55703 22.0566 8.55703C22.9354 8.55703 23.4223 8.94422 23.4223 9.6686V10.1535L21.6367 10.2569C19.9728 10.3534 19.0745 11.0069 19.0745 12.1371C19.0745 13.28 20.0008 14.0358 21.3324 14.0358C22.2319 14.0358 23.0632 13.6033 23.4417 12.9114H23.4685V13.9707H24.794V9.5779H24.8025ZM31.7137 7.56872H30.2604L28.577 12.7754H28.5502L26.8669 7.56872H25.3588L27.7858 13.9835L27.658 14.3706C27.4414 15.0299 27.0835 15.288 26.4482 15.288C26.308 15.2856 26.168 15.279 26.0282 15.2683V16.3275C26.1098 16.3531 26.4676 16.3601 26.576 16.3601C27.9757 16.3601 28.6318 15.8496 29.2063 14.3055L31.7137 7.56872Z" fill="#9C9FA2"></path><path d="M9.56107 11.4964C9.54769 11.4836 8.23557 11.0057 8.22218 9.55814C8.20879 8.35007 9.25678 7.76871 9.30425 7.73615C8.70905 6.89666 7.78887 6.80597 7.47119 6.78621C6.64594 6.74086 5.94241 7.23153 5.55048 7.23153C5.15125 7.23153 4.55605 6.80481 3.9073 6.81876C3.48374 6.82951 3.07051 6.94605 2.70876 7.15678C2.34701 7.36751 2.04935 7.66508 1.8454 8.01986C0.959297 9.48024 1.61535 11.6371 2.47468 12.8254C2.89339 13.4126 3.40095 14.059 4.06431 14.0335C4.69237 14.0079 4.94311 13.6463 5.70019 13.6463C6.46458 13.6463 6.68124 14.0335 7.34338 14.0276C8.03352 14.0149 8.45953 13.4405 8.88554 12.8521C9.35172 12.1801 9.54769 11.5348 9.56229 11.4952L9.56107 11.4964Z" fill="black"></path><path d="M5.46285 6.68389C6.03127 6.72923 6.59847 6.41297 6.95754 6.01183C7.3093 5.5979 7.53935 5.04328 7.47849 4.48053C6.97823 4.50029 6.35625 4.79679 5.99719 5.21071C5.6722 5.56651 5.3959 6.1409 5.46285 6.68389Z" fill="black"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M18.7167 8.04776C18.7167 6.32926 17.4654 5.15374 15.6798 5.15374H12.2182V13.9649H13.652V10.9546H15.6336C17.4459 10.9546 18.7167 9.76627 18.7167 8.04776ZM15.2952 9.80464C16.5464 9.80464 17.2561 9.16514 17.2561 8.05358C17.2561 6.9362 16.5464 6.30368 15.3025 6.30368H13.652V9.80464H15.2952Z" fill="black"></path><path fillRule="evenodd" clipRule="evenodd" d="M24.8025 9.5779C24.8025 8.30589 23.7339 7.485 22.098 7.485C20.5765 7.485 19.4543 8.31868 19.4129 9.45466H20.7043C20.8126 8.91166 21.3397 8.55703 22.0566 8.55703C22.9354 8.55703 23.4223 8.94422 23.4223 9.6686V10.1535L21.6367 10.2569C19.9728 10.3534 19.0745 11.0069 19.0745 12.1371C19.0745 13.28 20.0008 14.0358 21.3324 14.0358C22.2319 14.0358 23.0632 13.6033 23.4417 12.9114H23.4685V13.9707H24.794V9.5779H24.8025ZM21.7194 12.9824C20.9551 12.9824 20.4682 12.6335 20.4682 12.0975C20.4682 11.5417 20.9344 11.2243 21.8339 11.1662L23.4235 11.0697V11.5673C23.4235 12.3952 22.6932 12.9824 21.7194 12.9824Z" fill="black"></path><path d="M31.7137 7.56872H30.2604L28.577 12.7754H28.5502L26.8669 7.56872H25.3588L27.7858 13.9835L27.658 14.3706C27.4414 15.0299 27.0835 15.288 26.4482 15.288C26.308 15.2856 26.168 15.279 26.0282 15.2683V16.3275C26.1098 16.3531 26.4676 16.3601 26.576 16.3601C27.9757 16.3601 28.6318 15.8496 29.2063 14.3055L31.7137 7.56872Z" fill="black"></path>
    </svg>
);

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