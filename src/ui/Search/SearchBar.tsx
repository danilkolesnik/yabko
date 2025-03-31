'use client';
import styles from './search.module.scss';
import { useEffect, useState } from 'react';
import { medusa } from '@/lib/medusa';
import { SearchIcon, CloseIcon } from '@/assets/icons/icons';

export default function SearchBar({ setIsSearchOpen, hideOverlay } : { setIsSearchOpen: any, hideOverlay: any}) {
    
    const [searchQuery, setSearchQuery] = useState('')
    const [products, setProducts] = useState([]);

    const searchProducts = async (query: string) => {
        try {
            const { products } = await medusa.products.list({
                q: query,
                limit: 10 
            })
            console.log('Найденные товары:', products)
            setProducts(products);
        } catch (error) {
            console.error('Ошибка поиска:', error)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim()
        setSearchQuery(query)
        if (query.length > 0) {
            searchProducts(query)
        } else {
            setProducts([]);
        }
    }

    return (
        <div className={styles.searchBar}>
            <header className={styles.searchBarHeader}>
                <SearchIcon />
                <input
                    type="text"
                    placeholder=""
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles.searchBarInput}
                    onFocus={() => console.log('Фокус на инпут')}
                    onBlur={() => console.log('Потеря фокуса')}
                />
                <span className={styles.closeIconWrapper} onClick={() => {
                    hideOverlay();
                    setIsSearchOpen(false);
                }}>
                    <CloseIcon />
                </span>
            </header>
            <div className={styles.productSection}>
                {(products || []).map((product) => {
                    if (product?.variants) {
                        return product.variants.map((variant) => (
                            <div key={variant.id} className={styles.singleProductWrapper}>
                                <div className={styles.photoWrapper}>
                                    {product.images && <img src={product.images[0].url} alt="" />}
                                </div>
                                <div className={styles.infoWrapper}>
                                    <span>{variant.title}</span>
                                    <span>{variant?.metadata?.price}</span>
                                </div>
                            </div>
                        ));
                    } else {
                        <div key={product.id} className={styles.singleProductWrapper}>
                            <div className={styles.photoWrapper}>
                                {product.images && <img src={product.images[0].url} alt="" />}
                            </div>
                            <div className={styles.infoWrapper}>
                                <span>{product.title}</span>
                            </div>
                        </div>
                    }
                })}
            </div>
        </div>
    )
}