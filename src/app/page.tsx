import React from "react";
import "./styles.css";
import CategoriesList from "@/components/CategoriesList";
import ShowcaseSlider from "@/components/ShowcaseSlider";
import MedusaClient from "@medusajs/medusa-js";
import ProductSlider from "@/components/ProductSlider";

const medusa = new MedusaClient({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
  publishableApiKey: process.env.PUBLISHABLE_API_KEY,
});

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
      
      <ProductSlider />
      {/* @ts-ignore */}
      <ProductSlider products={products}/>
    </div>
  );
}
