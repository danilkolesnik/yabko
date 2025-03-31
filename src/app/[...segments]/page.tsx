'use client';
import { useState, useEffect } from "react";
import { Suspense } from "react";
import { medusa } from "@/lib/medusa";
import CatalogPage from "@/components/CatalogPage";
import AnimatedLoader from "@/ui/Loader/Loader";
import styles from "./page.module.scss";

export default function CatalogRoute({ params }: { params: Promise<{ segments: string[] }> }) {
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const resolvedParams = await params;
                const segments = resolvedParams.segments;

                if (!segments || segments.length === 0) {
                    setError("Категория не найдена");
                    return;
                }

                // Получаем категорию
                const categoryData = await getCategoryByPath(segments);
                if (!categoryData) {
                    setError("Категория не найдена");
                    return;
                }

                // Получаем хлебные крошки
                const breadcrumbsData = await getBreadcrumbs(segments);

                // Получаем продукты
                const productsData = await getProductsByCategory(categoryData.id);

                setCategory(categoryData);
                setBreadcrumbs(breadcrumbsData);
                setProducts(productsData);
            } catch (err) {
                setError("Произошла ошибка при загрузке данных");
                console.error("Ошибка:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategory();
    }, [params]);

    if (isLoading) return <AnimatedLoader />;
    if (error) return (
        <div className={styles.errorContainer}>
            <h1>{error}</h1>
            <p>{error === "Категория не найдена" 
                ? "Запрошенная категория не существует или была удалена." 
                : "Пожалуйста, попробуйте позже."}</p>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
                <CatalogPage 
                    category={category} 
                    products={products} 
                    breadcrumbs={breadcrumbs}
                />
            </Suspense>
        </div>
    );
}

// Остальные функции остаются без изменений
async function getBreadcrumbs(segments: string[]) {
    if (!segments || segments.length === 0) {
        return [];
    }

    const breadcrumbs = [];
    let path = '';

    for (let i = 0; i < segments.length; i++) {
        path += `/${segments[i]}`;
        
        try {
            const { product_categories } = await medusa.productCategories.list({
                handle: segments[i],
            });
            
            if (product_categories && product_categories.length > 0) {
                breadcrumbs.push({
                    name: product_categories[0].name,
                    path: path,
                });
            } else {
                breadcrumbs.push({
                    name: segments[i].charAt(0).toUpperCase() + segments[i].slice(1),
                    path: path,
                });
            }
        } catch (error) {
            console.error("Ошибка при получении данных для хлебных крошек:", error);
            breadcrumbs.push({
                name: segments[i].charAt(0).toUpperCase() + segments[i].slice(1),
                path: path,
            });
        }
    }

    return breadcrumbs;
}

async function getCategoryByPath(path: string[]) {
    try {
        const lastSegment = path[path.length - 1];
        const { product_categories } = await medusa.productCategories.list({
            handle: lastSegment,
            include_descendants_tree: true,
        });

        return product_categories[0] ?? null;
    } catch (error) {
        console.error("Ошибка при получении категории:", error);
        return null;
    }
}

async function getProductsByCategory(categoryId: string) {
    try {
        const { products } = await medusa.products.list({
            category_id: [categoryId],
            limit: 100,
        });
        return products;
    } catch (error) {
        console.error("Ошибка при получении продуктов:", error);
        return [];
    }
}
