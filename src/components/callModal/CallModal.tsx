'use client';
import styles from './call.modal.module.scss';
import { useCall } from "@/context/CallContext";
import { useRouter } from 'next/navigation';
import { useOverlay } from '@/context/OverlayContext';
import { CloseIcon } from '@/assets/icons/icons';

const CallModal = () => {
    const router = useRouter();
    const { isCallOpen, closeCall } = useCall();
    const { hideOverlay } = useOverlay();
    if (!isCallOpen) return null;

    const handleCloseModal = () => {
        closeCall();
        hideOverlay();
    };

    return (
        <div className={styles.cartModal}>
            <header className={styles.header}>
                <span onClick={handleCloseModal} className={styles.closeWrapper}>
                    <CloseIcon />
                </span>
            </header>
            <h6 className={styles.callCaption}>Хочете, зателефонуємо Вам за 30 секунд?</h6>
            <form className={styles.callFormWrapper}>
                <input type="text" placeholder='Ваш номер телефону'/>
                <button>Зателефонуйте</button>
                <span>Наприклад: 067 000 00 00</span>
            </form>
            <article className={styles.bottomArticle}>
                <span>Вільних операторів на лінії: 102</span>
                <span>Замовлень дзвінків за сьогодні: 20+</span>
            </article>
        </div>
    );
};

export default CallModal;