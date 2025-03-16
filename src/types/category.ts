
interface CategoryMetadata {
  slider?: boolean;
  picture?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  handle: string;
  rank: number;
  parent_category_id: string | null;
  created_at: string;
  updated_at: string;
  metadata?: CategoryMetadata;
  parent_category?: Category | null;
  category_children?: Category[];
}