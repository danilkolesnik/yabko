export interface ProductTag {
  id: string;
  value: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  metadata?: any;
  rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductOptionValue {
  id: string;
  value: string;
  metadata?: any;
  option_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProductOption {
  id: string;
  title: string;
  metadata?: any;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string | null;
  barcode?: string | null;
  ean?: string | null;
  upc?: string | null;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code?: string | null;
  origin_country?: string | null;
  mid_code?: string | null;
  material?: string | null;
  weight?: number | null;
  length?: number | null;
  height?: number | null;
  width?: number | null;
  metadata?: any;
  variant_rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  options: ProductOptionValue[];
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  handle: string;
  is_giftcard: boolean;
  discountable: boolean;
  thumbnail?: string | null;
  collection_id?: string | null;
  type_id?: string | null;
  weight?: number | null;
  length?: number | null;
  height?: number | null;
  width?: number | null;
  hs_code?: string | null;
  origin_country?: string | null;
  mid_code?: string | null;
  material?: string | null;
  created_at: string;
  updated_at: string;
  type?: any;
  collection?: { id: string } | null;
  options: ProductOption[];
  tags: ProductTag[];
  images: ProductImage[];
  variants: ProductVariant[];
}

export type CategoryProducts = Record<string, Product[]>;