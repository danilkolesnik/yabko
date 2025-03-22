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
  id?: string | null | undefined;
  title?: string | null | undefined;
  subtitle?: string | null | undefined;
  description?: string | null | undefined;
  handle?: string | null | undefined ;
  is_giftcard?: boolean | null | undefined ;
  discountable?: boolean | null | undefined;
  thumbnail?: string | null | undefined;
  collection_id?: string | null | undefined;
  type_id?: string | null | undefined;
  weight?: number | null | undefined;
  length?: number | null | undefined;
  height?: number | null | undefined;
  width?: number | null | undefined;
  hs_code?: string | null | undefined;
  origin_country?: string | null | undefined;
  mid_code?: string | null | undefined;
  material?: string | null | undefined;
  created_at?: Date | undefined;
  updated_at?: Date | undefined;
  type?: any | null | undefined;
  collection?: { id: string } | null | undefined;
  options?: ProductOption[] | null | undefined;
  tags?: ProductTag[] | null | undefined;
  images?: ProductImage[] | null | undefined;
  variants?: ProductVariant[] | null | undefined;
}

export type CategoryProducts = Record<string, Product[]>;