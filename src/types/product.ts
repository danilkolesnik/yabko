export interface ProductImage {
    url: string;
  }
  
export interface ProductVariant {
    prices: {
      amount: number;
      currency_code: string;
    }[];
  }
  
  export interface Product {
    id: string;
    title: string;
    description: string;
    images: ProductImage[];
    variants: ProductVariant[];
  }