"use client";
import React, { useEffect, useState } from "react";
import "./styles.css";
import BrandList from "@/components/brandList/BrandList";
import CartModal from "@/components/cartModal/CartModal";
import Overlay from "@/ui/Overlay/Overlay";
import ProductSlider from "@/components/ProductSlider";
import CategoriesList from "@/components/CategoriesList";
import ShowcaseSlider from "@/components/showcase/ShowcaseSlider";
import DescriptionSection from "@/components/description/DescriptionSection";
import { medusa } from "@/lib/medusa";

export default function HomePage() {
  
  
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [sliderCategories, setSliderCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: any[] }>({});
  const [productCategories, setProductCategories] = useState<any[]>([]);

  const fetchProductsByCategories = async (filteredCategories: any[]) => {
    const updatedProducts: { [key: string]: any[] } = {};
    
    const fetchProducts = async (categoryId: string) => {
      try {
        const { products } = await medusa.products.list({
          category_id: [categoryId],
        });
        return products;
      } catch (error) {
        console.error("Ошибка при получении продуктов для категории", categoryId, error);
        return [];
      }
    };
  
    for (const category of filteredCategories) {
      const categoryId = category.id;
      
      try {
        const products = await fetchProducts(categoryId);
        
        updatedProducts[categoryId] = products;
  
        for (const childCategory of category.category_children || []) {
          const childProducts = await fetchProducts(childCategory.id);
          updatedProducts[childCategory.id] = childProducts;
        }
        
      } catch (error) {
        console.error("Ошибка при обработке категории", categoryId, error);
      }
    }
    setCategoryProducts(updatedProducts);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ products }, { product_categories }] = await Promise.all([
          medusa.products.list(),
          medusa.productCategories.list(),
        ]);
        setProducts(products);
        setProductCategories(product_categories);

        const filteredCategories = product_categories.filter((category: any) => {
          return category.metadata?.slider === true;
        });

        fetchProductsByCategories(filteredCategories);
        setSliderCategories(filteredCategories);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <CartModal />
        <Overlay />
        <div className="hero-wrapper">
          <CategoriesList products={products} productCategories={productCategories} setShowOverlay={setShowOverlay}/>
          <ShowcaseSlider />
        </div>
        <div id='brands'>
          <BrandList productCategories={productCategories} />
        </div>
        <div id='catalog'>
          {(sliderCategories || []).map((category) => (
            <ProductSlider key={category.id} category={category} categoryProducts={categoryProducts} setShowOverlay={setShowOverlay} />
          ))}
        </div>
        <DescriptionSection />
      </div>
    </>
  );
}
