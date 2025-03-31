'use client';
import { useState, useEffect } from "react";
import { medusa } from "@/lib/medusa";
import ProductPage from './ProductPage';
import AnimatedLoader from "@/ui/Loader/Loader";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default function Page({ params }: PageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const resolvedParams = await params; // Unwrap the Promise
                const variantId = resolvedParams.slug;

                const productData = await getProductByVariantMetadataId(variantId);
                const variant = productData.variants.find(v => v.metadata?.id === variantId);

                setProduct({ product: productData, variant });
            } catch (err) {
                setError("Произошла ошибка при загрузке продукта");
                console.error("Error:", err);
            } finally {
                setIsLoading(false); // Ensure this is called after the request
            }
        };

        fetchProduct();
    }, [params]);

    if (isLoading) return <AnimatedLoader />;
    if (error) return <div>{error}</div>;
    if (!product) return null;

    return <ProductPage product={product.product} initialVariant={product.variant} />;
}

async function getProductByVariantMetadataId(variantId: string) {
    const { products } = await medusa.products.list({ limit: 100 });

    const product = products.find((product) =>
        product.variants.some((variant) => variant.metadata?.id === variantId)
    );

    if (!product) {
        throw new Error("Продукт с таким вариантом не найден");
    }

    return product;
}