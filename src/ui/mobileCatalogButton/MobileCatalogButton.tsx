import styles from './button.module.scss';
import { MobileCatalogIcon } from '@/assets/icons/icons';

interface MobileCatalogButtonProps {
    onClick?: () => void;
}

const MobileCatalogButton: React.FC<MobileCatalogButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className={styles.mobileCatalogButton}>
            <span className={styles.catalogIconWrapper}>
                <MobileCatalogIcon />
            </span>
            <span className={styles.catalogButtonTitle}>
                Каталог товарiв
            </span>
        </button>
    )
}

export default MobileCatalogButton;