import { medusa } from "@/lib/medusa";
import ProductPage from './ProductPage';

type PageProps = {
    params: {
        slug: string;
    };
};

export default async function Page({ params }: PageProps) {
    try {
        const variantId = await params.slug;
        const product = await getProductByVariantMetadataId(variantId);
        const variant = product.variants.find(v => v.metadata?.id === variantId);
        
        return <ProductPage product={product} initialVariant={variant} />;
    } catch (error) {
        console.error("Error:", error);
        return <div>Произошла ошибка при загрузке продукта</div>;
    }
}

async function getProductByVariantMetadataId(variantId: string) {
    const { products } = await medusa.products.list({
        limit: 100, // Adjust based on your catalog size
    });
    
    const product = products.find((product) => 
        product.variants.some((variant) => variant.metadata?.id === variantId)
    );
    
    if (!product) {
        throw new Error("Продукт с таким вариантом не найден");
    }

    return product;
}