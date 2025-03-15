import React from "react";
import "./styles.css";
import CategoriesList from "@/components/CategoriesList";
import ShowcaseSlider from "@/components/ShowcaseSlider";
import MedusaClient from "@medusajs/medusa-js";
import ProductSlider from "@/components/ProductSlider";
import { medusa } from "@/lib/medusa";


export async function getProducts(): Promise<any> {
  const { products } = await medusa.products.list();
  return products;
}

async function getCategories(): Promise<any> {
  const { product_categories } = await medusa.productCategories.list();
  return product_categories;
}

export default async function HomePage() {
  const products = await getProducts();
  const productCategories = await getCategories();
  return (
    <div className="page-wrapper">
      <div className="hero-wrapper">
        <CategoriesList products={products} productCategories={productCategories} />
        <ShowcaseSlider />
      </div>
      
      <ProductSlider products={products}/>
      {/* <ProductSlider products={products}/> */}
    </div>
  );
}
