"use client";
import React, { useEffect, useState } from "react";
import "./styles.css";
import ProductSlider from "@/components/ProductSlider";
import CategoriesList from "@/components/CategoriesList";
import ShowcaseSlider from "@/components/showcase/ShowcaseSlider";
import DescriptionSection from "@/components/description/DescriptionSection";
import { medusa } from "@/lib/medusa";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ products }, { product_categories }] = await Promise.all([
          medusa.products.list(),
          medusa.productCategories.list(),
        ]);
        setProducts(products);
        setProductCategories(product_categories);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-wrapper">
      {<div className={`overlay ${showOverlay ? "active" : ""}`} />}
      <div className="hero-wrapper">
        <CategoriesList products={products} productCategories={productCategories} setShowOverlay={setShowOverlay}/>
        <ShowcaseSlider />
      </div>
      {/* @ts-ignore */}
      <ProductSlider productCategories={productCategories} />
      <DescriptionSection />
    </div>
  );
}
