import styles from './brand.list.module.scss';

const BrandList = ({ productCategories } : any) => {
    console.log('brands', productCategories)
    return (
        <div className={styles.brands}>
            <div className={styles.brandListWrapper}>
                { productCategories?.map((category: any) => {
                    if (category.metadata?.brand_picture) {
                        return (
                            <a key={category.id} href={`/${category.handle}`} className={styles.brandCard}>
                                {category.metadata.brand_picture && <img src={category.metadata.brand_picture} alt="" />}
                            </a>
                        )
                    }
                })}
            </div>
            <div className={styles.subcategoryListWrapper}>
                { productCategories?.map((category: any) => {
                    if (category.category_children.length > 0) {
                        return category.category_children.map((subcategory: any) => (
                            <a key={subcategory.id} href={`/${subcategory?.handle}`} className={styles.subcategoryCard}>
                                {subcategory.metadata?.picture && <img src={subcategory.metadata.picture} alt="" className={styles.subcategoryPic}/>}
                                <span className={styles.subCategoryName}>{subcategory.name}</span>
                            </a>
                        ))
                    }
                })}
            </div>
        </div>
    )
}

export default BrandList;