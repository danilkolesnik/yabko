'use client';
import styles from './search.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { medusa } from '@/lib/medusa';
import { SearchIcon, CloseIcon } from '@/assets/icons/icons';

export default function SearchBar({ setIsSearchOpen, hideOverlay } : { setIsSearchOpen: any, hideOverlay: any}) {
    const router = useRouter();
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
                            <div onClick={() => {
                                hideOverlay();
                                setIsSearchOpen(false);
                                router.push(`${variant?.metadata?.handle}`)
                            }} key={variant.id} className={styles.singleProductWrapper}>
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
                        <div onClick={() => {
                            hideOverlay();
                            setIsSearchOpen(false);
                            router.push(`/products/${product?.handle}`)
                        }}
                        key={product.id} className={styles.singleProductWrapper}>
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