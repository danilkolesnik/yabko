import React from "react";
import "./styles.css";
import CategoriesList from "@/components/CategoriesList";
import ShowcaseSlider from "@/components/ShowcaseSlider";
import MedusaClient from "@medusajs/medusa-js";

const medusa = new MedusaClient({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
  publishableApiKey: "pk_663b902fa9d121d36d575a08b359d6ffd61f1fe747b2beb5c0f7d32086e41d28",
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
  console.log(products);
  const productCategories = await getCategories();
  return (
    <div className="page-wrapper">
      <CategoriesList products={products} productCategories={productCategories} />
      <ShowcaseSlider />
    </div>
  );
}
